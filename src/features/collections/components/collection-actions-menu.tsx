'use client';

import type { Collection, CollectionId } from '@/features/collections/types';

import {
  ActionsGroup,
  DeleteBlockedDialog,
  DeleteConfirmDialog,
  useEntityDeleteConfirm,
} from '@/components/actions-group';
import { deleteCollectionAction } from '@/features/collections/actions/delete-collection';
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
  const {
    deleteDialogOpen,
    handleDelete,
    isDeleting,
    menuItems,
    setDeleteDialogOpen,
  } = useEntityDeleteConfirm({
    deleteAction: deleteCollectionAction,
    failureTitle: 'Failed to delete collection',
    id: collection._id as CollectionId,
    successTitle: 'Collection deleted',
    viewUrl,
  });

  return (
    <>
      <ActionsGroup disabled={isDeleting} menuItems={menuItems} />

      {talkCount > 0 ? (
        <DeleteBlockedDialog
          blockReason={`This collection has ${talkCount} ${pluralize(talkCount, 'talk', 'talks')}. Remove all talks before deleting.`}
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
