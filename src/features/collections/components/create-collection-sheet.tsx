'use client';

import type { Collection, CollectionId } from '@/features/collections/types';
import type { CollectionFormData } from '../schemas/collection-form';

import { useEffect, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Button,
  FormError,
  Sheet,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from '@/components/ui';
import { createCollectionAction } from '@/features/collections/actions/create-collection';
import { setServerErrors } from '@/lib/forms/react-hook-form';
import { collectionFormSchema } from '../schemas/collection-form';
import { CollectionFormFields } from './collection-form-fields';

type NewCollection = Pick<Collection, '_id' | 'title' | 'slug'>;

interface CreateCollectionSheetProps {
  onOpenChange: (open: boolean) => void;
  onCollectionCreated: (collectionId: CollectionId, collection: NewCollection) => void;
  open: boolean;
}

export function CreateCollectionSheet({
  onOpenChange,
  onCollectionCreated,
  open,
}: CreateCollectionSheetProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionFormSchema),
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

      const newCollection: NewCollection = {
        _id: result.data.collectionId,
        title: data.title,
        slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      };

      onCollectionCreated(result.data.collectionId, newCollection);
      onOpenChange(false);
    });
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [form, open]);

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup side="right">
        <SheetHeader>
          <SheetTitle>Add New Collection</SheetTitle>
        </SheetHeader>

        <form className="grid min-h-0 flex-1 grid-rows-[1fr_auto]" onSubmit={handleSubmit}>
          <SheetPanel>
            <FormError error={form.formState.errors.root} />

            <CollectionFormFields control={form.control} />
          </SheetPanel>

          <SheetFooter>
            <Button
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? 'Creating...' : 'Create Collection'}
            </Button>
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  );
}
