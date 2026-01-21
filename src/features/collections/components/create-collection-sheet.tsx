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
import { createCollectionAction } from '@/features/collections/actions';
import { setServerErrors } from '@/lib/forms/react-hook-form';

const createCollectionSchema = z.object({
  description: z.string().optional(),
  title: z.string().trim().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type CreateCollectionFormData = z.infer<typeof createCollectionSchema>;

type NewCollection = Pick<Collection, '_id' | 'title' | 'slug'>;

interface CreateCollectionSheetProps {
  onOpenChange: (open: boolean) => void;
  onCollectionCreated: (collectionId: CollectionId, collection: NewCollection) => void;
  open: boolean;
  /** For nested sheets, use 'nested' to stack above other sheets */
  zIndex?: 'default' | 'nested';
}

export function CreateCollectionSheet({
  onOpenChange,
  onCollectionCreated,
  open,
  zIndex = 'default',
}: CreateCollectionSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateCollectionFormData>({
    defaultValues: {
      description: '',
      title: '',
      url: '',
    },
    resolver: zodResolver(createCollectionSchema),
  });

  useEffect(() => {
    if (!open) {
      form.reset();
      form.clearErrors();
      setError(null);
    }
  }, [form, open]);

  const handleSubmit = form.handleSubmit((data) => {
    setError(null);
    startTransition(async () => {
      const result = await createCollectionAction(data);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        setError('Failed to create collection. Please check the errors below.');
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

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup side="right" size="sm" zIndex={zIndex}>
        <SheetHeader>
          <SheetTitle>Add New Collection</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit}>
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
              {isPending ? 'Creating...' : 'Create Collection'}
            </Button>
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  );
}
