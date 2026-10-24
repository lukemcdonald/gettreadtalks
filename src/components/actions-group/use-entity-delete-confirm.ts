'use client';

import type { ActionResult } from '@/lib/forms/types';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { toastManager } from '@/components/ui/primitives/toast';
import { formatErrorMessage } from '@/services/errors';

import { getContentMenuItems } from './get-content-menu-items';

type DeleteActionResult = ActionResult<unknown> | void;

interface UseEntityDeleteConfirmOptions<TId> {
  deleteAction?: (id: TId) => Promise<DeleteActionResult>;
  failureTitle: string;
  id: TId;
  listUrl?: string;
  successTitle: string;
  viewUrl?: string;
}

function isFailedActionResult(
  result: DeleteActionResult
): result is Extract<ActionResult<unknown>, { success: false }> {
  return result != null && result.success === false;
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
          description: result.errors.root ?? 'An error occurred',
          title: failureTitle,
          type: 'error',
        });
        return;
      }

      toastManager.add({ title: successTitle, type: 'success' });
      setDeleteDialogOpen(false);

      if (listUrl) {
        router.push(listUrl);
      } else {
        router.refresh();
      }
    } catch (error: unknown) {
      toastManager.add({
        description: formatErrorMessage(error),
        title: failureTitle,
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
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
