'use client';

import type { ActionResult } from '@/lib/forms/types';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { toastManager } from '@/components/ui/primitives/toast';
import { formatErrorMessage } from '@/services/errors';

import { getContentMenuItems } from './get-content-menu-items';

interface UseEntityDeleteConfirmOptions<TId> {
  deleteAction: (id: TId) => Promise<ActionResult<null>>;
  failureTitle: string;
  id: TId;
  successTitle: string;
  viewUrl?: string;
}

export function useEntityDeleteConfirm<TId>({
  deleteAction,
  failureTitle,
  id,
  successTitle,
  viewUrl,
}: UseEntityDeleteConfirmOptions<TId>) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteAction(id);

      if (result.success) {
        toastManager.add({ title: successTitle, type: 'success' });
        setDeleteDialogOpen(false);
        router.refresh();
      } else {
        toastManager.add({
          description: result.errors?.root ?? 'An error occurred',
          title: failureTitle,
          type: 'error',
        });
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
      onDelete: () => setDeleteDialogOpen(true),
      viewUrl,
    }),
    setDeleteDialogOpen,
  };
}
