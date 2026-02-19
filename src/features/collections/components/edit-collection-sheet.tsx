'use client';

import type { Collection, CollectionId } from '@/features/collections/types';
import type { CollectionFormData } from '../schemas/collection-form';

import { useTransition } from 'react';
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
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup side="right">
        <SheetHeader>
          <SheetTitle>Edit Collection</SheetTitle>
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
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  );
}
