'use client';

import type { Collection, CollectionId } from '@/features/collections/types';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { ActionsGroup, DeleteGuardDialog } from '@/components/actions-group';
import { toastManager } from '@/components/ui/primitives/toast';
import { destroyCollectionAction } from '@/features/collections/actions/destroy-collection';
import { getErrorMessage } from '@/services/errors';
import { pluralize } from '@/utils';

interface CollectionActionsMenuProps {
  collection: Pick<Collection, '_id' | 'slug' | 'title'>;
  talkCount: number;
}

export function CollectionActionsMenu({ collection, talkCount }: CollectionActionsMenuProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const collectionId = collection._id as CollectionId;

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await destroyCollectionAction(collectionId);

      if (!result.success) {
        toastManager.add({
          description: result.errors?.root ?? 'An error occurred',
          title: 'Failed to delete collection',
          type: 'error',
        });
        return;
      }

      toastManager.add({ title: 'Collection deleted', type: 'success' });
      setDeleteDialogOpen(false);
      router.refresh();
    } catch (error: unknown) {
      toastManager.add({
        description: getErrorMessage(error),
        title: 'Failed to delete collection',
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const blockReason = `This collection has ${talkCount} ${pluralize(talkCount, 'talk', 'talks')}. Remove all talks before deleting.`;

  const menuItems = [
    { href: `/collections/${collection.slug}`, label: 'View' },
    { href: `/collections/edit/${collectionId}`, label: 'Edit' },
    {
      label: 'Delete',
      onClick: () => setDeleteDialogOpen(true),
      separator: true,
      variant: 'destructive' as const,
    },
  ];

  return (
    <>
      <ActionsGroup disabled={isDeleting} menuItems={menuItems} />

      <DeleteGuardDialog
        blockReason={blockReason}
        count={talkCount}
        isDeleting={isDeleting}
        name={collection.title}
        onDelete={handleDelete}
        onOpenChange={setDeleteDialogOpen}
        open={deleteDialogOpen}
      />
    </>
  );
}
