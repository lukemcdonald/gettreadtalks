'use client';

import type { CollectionFormData } from '../schemas/collection-form';
import type { CollectionId } from '@/features/collections/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { FormSheet } from '@/components/ui';
import { createCollectionAction } from '@/features/collections/actions/create-collection';
import { setServerErrors } from '@/lib/forms/react-hook-form';

import { collectionFormSchema } from '../schemas/collection-form';
import { CollectionFormFields } from './collection-form-fields';

interface CreateCollectionSheetProps {
  onCollectionCreated: (collectionId: CollectionId) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function CreateCollectionSheet({
  onCollectionCreated,
  onOpenChange,
  open,
}: CreateCollectionSheetProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CollectionFormData>({
    defaultValues: {
      description: '',
      title: '',
      url: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(collectionFormSchema),
  });

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = await createCollectionAction(data);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      onCollectionCreated(result.data.collectionId);
      onOpenChange(false);
    });
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [form, open]);

  return (
    <FormSheet
      error={form.formState.errors.root}
      isPending={isPending}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel="Create Collection"
      title="Add New Collection"
    >
      <CollectionFormFields control={form.control} />
    </FormSheet>
  );
}
