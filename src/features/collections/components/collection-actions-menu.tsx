'use client';

import type { Collection, CollectionId } from '@/features/collections/types';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  ActionsGroup,
  DeleteBlockedDialog,
  DeleteConfirmDialog,
  getEntityMenuItems,
} from '@/components/actions-group';
import { toastManager } from '@/components/ui/primitives/toast';
import { destroyCollectionAction } from '@/features/collections/actions/destroy-collection';
import { getErrorMessage } from '@/services/errors';
import { pluralize } from '@/utils';

interface CollectionActionsMenuProps {
  collection: Pick<Collection, '_id' | 'slug' | 'title'>;
  talkCount: number;
  viewUrl?: string;
}

export function CollectionActionsMenu({
  collection,
  talkCount,
  viewUrl,
}: CollectionActionsMenuProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const collectionId = collection._id as CollectionId;

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await destroyCollectionAction(collectionId);

      if (result.success) {
        toastManager.add({ title: 'Collection deleted', type: 'success' });
        setDeleteDialogOpen(false);
        router.refresh();
      } else {
        toastManager.add({
          description: result.errors?.root ?? 'An error occurred',
          title: 'Failed to delete collection',
          type: 'error',
        });
      }
    } catch (error: unknown) {
      toastManager.add({
        description: getErrorMessage(error),
        title: 'Failed to delete collection',
        type: 'error',
      });
    }

    setIsDeleting(false);
  };

  const blockReason = `This collection has ${talkCount} ${pluralize(talkCount, 'talk', 'talks')}. Remove all talks before deleting.`;

  const menuItems = getEntityMenuItems({
    onDelete: () => setDeleteDialogOpen(true),
    viewUrl,
  });

  return (
    <>
      <ActionsGroup disabled={isDeleting} menuItems={menuItems} />

      {talkCount > 0 ? (
        <DeleteBlockedDialog
          blockReason={blockReason}
          name={collection.title}
          onOpenChange={setDeleteDialogOpen}
          open={deleteDialogOpen}
        />
      ) : (
        <DeleteConfirmDialog
          isDeleting={isDeleting}
          name={collection.title}
          onDelete={handleDelete}
          onOpenChange={setDeleteDialogOpen}
          open={deleteDialogOpen}
        />
      )}
    </>
  );
}
