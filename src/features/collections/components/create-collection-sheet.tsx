'use client';

import type { CollectionFormData } from '../schemas/collection-form';
import type { CollectionId } from '@/features/collections/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormSheet } from '@/components/ui';
import { createCollectionAction } from '@/features/collections/actions/create-collection';
import { useCreateFormSheet } from '@/lib/forms/use-create-form-sheet';

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
  const form = useForm<CollectionFormData>({
    defaultValues: {
      description: '',
      title: '',
      url: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(collectionFormSchema),
  });

  const { handleSubmit, isPending } = useCreateFormSheet({
    form,
    onOpenChange,
    onSuccess: (data) => {
      onCollectionCreated(data.collectionId);
    },
    open,
    submit: createCollectionAction,
  });

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
