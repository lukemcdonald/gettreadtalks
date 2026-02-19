'use client';

import type { CollectionFormData } from '../schemas/collection-form';

import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { FormSheet } from '@/components/ui';
import { createCollectionAction } from '@/features/collections/actions/create-collection';
import { setServerErrors } from '@/lib/forms/react-hook-form';
import { collectionFormSchema } from '../schemas/collection-form';
import { CollectionFormFields } from './collection-form-fields';

export function CreateCollectionSheet() {
  const { handleOpenChange, handleSuccess } = useSheetRoute();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionFormSchema),
    mode: 'onBlur',
    defaultValues: {
      description: '',
      title: '',
      url: '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = await createCollectionAction(data);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      handleSuccess();
    });
  });

  return (
    <FormSheet
      error={form.formState.errors.root}
      isPending={isPending}
      onOpenChange={handleOpenChange}
      onSubmit={handleSubmit}
      open
      pendingLabel="Creating..."
      submitLabel="Create Collection"
      title="Add New Collection"
    >
      <CollectionFormFields control={form.control} />
    </FormSheet>
  );
}
