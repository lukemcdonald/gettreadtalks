'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { toastManager } from '@/components/ui/primitives/toast';
import { formatErrorMessage } from '@/services/errors';

import { getActionErrorMessage, isFailedActionResult } from './action-result';
import { getContentMenuItems } from './get-content-menu-items';

interface UseEntityDeleteConfirmOptions<TId> {
  deleteAction?: (id: TId) => Promise<unknown>;
  failureTitle: string;
  id: TId;
  listUrl?: string;
  successTitle: string;
  viewUrl?: string;
}

export function useEntityDeleteConfirm<TId>({
  deleteAction,
  failureTitle,
  id,
  listUrl,
  successTitle,
  viewUrl,
}: UseEntityDeleteConfirmOptions<TId>) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteAction) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteAction(id);

      if (isFailedActionResult(result)) {
        toastManager.add({
          description: getActionErrorMessage(result),
          title: failureTitle,
          type: 'error',
        });
      } else {
        toastManager.add({ title: successTitle, type: 'success' });
        setDeleteDialogOpen(false);

        if (listUrl) {
          router.push(listUrl);
        } else {
          router.refresh();
        }
      }
    } catch (error: unknown) {
      toastManager.add({
        description: formatErrorMessage(error),
        title: failureTitle,
        type: 'error',
      });
    }

    setIsDeleting(false);
  };

  return {
    deleteDialogOpen,
    handleDelete,
    isDeleting,
    menuItems: getContentMenuItems({
      onDelete: deleteAction ? () => setDeleteDialogOpen(true) : undefined,
      viewUrl,
    }),
    setDeleteDialogOpen,
  };
}
