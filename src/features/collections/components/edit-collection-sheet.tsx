'use client';

import type { Collection, CollectionId } from '@/features/collections/types';

import { useEffect, useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Sheet,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
  TextField,
  TextareaField,
  UrlField,
} from '@/components/ui';
import { updateCollectionAction } from '@/features/collections/actions/update-collection';
import { setServerErrors } from '@/lib/forms/react-hook-form';

// TODO: Move to schema.ts file to be shared.
const updateCollectionSchema = z.object({
  description: z.string().optional(),
  title: z.string().trim().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});
// TODO: move to types.ts file to be shared.
type UpdateCollectionFormData = z.infer<typeof updateCollectionSchema>;

interface EditCollectionSheetProps {
  collection: Collection | null;
  onCollectionUpdated: (collectionId: CollectionId) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

// TODO: Simplify and DRY this up with create-collection-sheet where possible. This file is too big.

export function EditCollectionSheet({
  collection,
  onCollectionUpdated,
  onOpenChange,
  open,
}: EditCollectionSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateCollectionFormData>({
    defaultValues: {
      description: collection?.description ?? '',
      title: collection?.title ?? '',
      url: collection?.url ?? '',
    },
    resolver: zodResolver(updateCollectionSchema),
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

            <div className="space-y-4">
              <TextField
                control={form.control}
                description="Name of the sermon series or collection"
                label="Title"
                name="title"
                placeholder="Romans Series"
                required
              />

              <TextareaField
                control={form.control}
                description="Brief description of this collection"
                label="Description"
                name="description"
                placeholder="A verse-by-verse study through the book of Romans..."
                rows={3}
              />

              <UrlField
                control={form.control}
                description="Link to the collection's page on the speaker's site"
                label="URL"
                name="url"
                placeholder="https://example.com/series/romans"
              />
            </div>
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
