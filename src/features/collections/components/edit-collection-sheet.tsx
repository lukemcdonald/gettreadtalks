'use client';

import type { Collection, CollectionId } from '@/features/collections/types';
import type { CollectionFormData } from '../schemas/collection-form';

import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormSheet } from '@/components/ui';
import { updateCollectionAction } from '@/features/collections/actions/update-collection';
import { setServerErrors } from '@/lib/forms/react-hook-form';
import { collectionFormSchema } from '../schemas/collection-form';
import { CollectionFormFields } from './collection-form-fields';

interface EditCollectionSheetProps {
  collection: Collection | null;
  onCollectionUpdated: (collectionId: CollectionId) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function EditCollectionSheet({
  collection,
  onCollectionUpdated,
  onOpenChange,
  open,
}: EditCollectionSheetProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionFormSchema),
    mode: 'onBlur',
    values: {
      description: collection?.description ?? '',
      title: collection?.title ?? '',
      url: collection?.url ?? '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (!collection) {
      return;
    }

    startTransition(async () => {
      const result = await updateCollectionAction(data, collection._id);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      onCollectionUpdated(collection._id);
      onOpenChange(false);
    });
  });

  if (!collection) {
    return null;
  }

  return (
    <FormSheet
      error={form.formState.errors.root}
      isPending={isPending}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel="Save Changes"
      title="Edit Collection"
    >
      <CollectionFormFields control={form.control} />
    </FormSheet>
  );
}
