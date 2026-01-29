'use client';

import type { Collection, CollectionId } from '@/features/collections/types';
import type { CollectionFormData } from '../schemas/collection-form';

import { useEffect, useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Button,
  Sheet,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from '@/components/ui';
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
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CollectionFormData>({
    defaultValues: {
      description: collection?.description ?? '',
      title: collection?.title ?? '',
      url: collection?.url ?? '',
    },
    resolver: zodResolver(collectionFormSchema),
  });

  useEffect(() => {
    if (open && collection) {
      form.reset({
        description: collection.description ?? '',
        title: collection.title,
        url: collection.url ?? '',
      });
      setError(null);
    }
  }, [form, open, collection]);

  const handleSubmit = form.handleSubmit((data) => {
    if (!collection) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await updateCollectionAction(data, collection._id);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        setError('Failed to update collection. Please check the errors below.');
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
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup side="right">
        <SheetHeader>
          <SheetTitle>Edit Collection</SheetTitle>
        </SheetHeader>

        <form className="grid min-h-0 flex-1 grid-rows-[1fr_auto]" onSubmit={handleSubmit}>
          <SheetPanel>
            {!!error && (
              <div className="mb-4 rounded-md bg-destructive/15 p-3 text-destructive-foreground text-sm">
                {error}
              </div>
            )}

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
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  );
}
