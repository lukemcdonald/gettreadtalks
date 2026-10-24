'use client';

import type { ContentActionsGroupProps } from './actions-group.types';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { toastManager } from '@/components/ui/primitives/toast';
import { formatArchiveLabel } from '@/lib/entities/utils';
import { formatErrorMessage } from '@/services/errors';
import { capitalize } from '@/utils';

import { getContentMenuItems } from './get-content-menu-items';

type ContentActionsStateProps = Pick<
  ContentActionsGroupProps,
  | 'additionalActions'
  | 'content'
  | 'contentType'
  | 'disabled'
  | 'listUrl'
  | 'onArchiveAction'
  | 'onDeleteAction'
  | 'viewUrl'
>;

function toastContentAction({
  error,
  title,
  type,
}: {
  error?: unknown;
  title: string;
  type: 'error' | 'success';
}) {
  toastManager.add({
    description: error === undefined ? undefined : formatErrorMessage(error),
    title,
    type,
  });
}

function useArchiveContent({
  contentId,
  contentType,
  isArchived,
  onArchiveAction,
}: {
  contentId: ContentActionsGroupProps['content']['_id'];
  contentType: string;
  isArchived: boolean;
  onArchiveAction?: ContentActionsGroupProps['onArchiveAction'];
}) {
  const router = useRouter();
  const [isArchiving, setIsArchiving] = useState(false);

  async function handleArchive() {
    if (!onArchiveAction) {
      return;
    }

    setIsArchiving(true);

    try {
      await onArchiveAction(contentId);
      toastContentAction({
        title: `${capitalize(contentType)} ${isArchived ? 'unarchived' : 'archived'}`,
        type: 'success',
      });
      router.refresh();
    } catch (error: unknown) {
      toastContentAction({
        error,
        title: `Failed to archive ${contentType}`,
        type: 'error',
      });
    }

    setIsArchiving(false);
  }

  return { handleArchive, isArchiving };
}

function useDeleteContent({
  contentId,
  contentType,
  listUrl,
  onDeleteAction,
}: {
  contentId: ContentActionsGroupProps['content']['_id'];
  contentType: string;
  listUrl?: string;
  onDeleteAction?: ContentActionsGroupProps['onDeleteAction'];
}) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!onDeleteAction) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDeleteAction(contentId);
      toastContentAction({
        title: `${capitalize(contentType)} deleted`,
        type: 'success',
      });
      setDeleteDialogOpen(false);

      if (listUrl) {
        router.push(listUrl);
      } else {
        router.refresh();
      }
    } catch (error: unknown) {
      toastContentAction({
        error,
        title: `Failed to delete ${contentType}`,
        type: 'error',
      });
    }

    setIsDeleting(false);
  }

  return {
    deleteDialogOpen,
    handleDelete,
    isDeleting,
    setDeleteDialogOpen,
  };
}

export function useContentActions({
  additionalActions,
  content,
  contentType,
  disabled,
  listUrl,
  onArchiveAction,
  onDeleteAction,
  viewUrl,
}: ContentActionsStateProps) {
  const isArchived = content.status === 'archived';
  const { handleArchive, isArchiving } = useArchiveContent({
    contentId: content._id,
    contentType,
    isArchived,
    onArchiveAction,
  });
  const { deleteDialogOpen, handleDelete, isDeleting, setDeleteDialogOpen } =
    useDeleteContent({
      contentId: content._id,
      contentType,
      listUrl,
      onDeleteAction,
    });

  return {
    deleteDialogOpen,
    handleDelete,
    isDeleting,
    isDisabled: disabled || isArchiving || isDeleting,
    menuItems: getContentMenuItems({
      additionalActions,
      archive: onArchiveAction
        ? {
            disabled: isArchiving,
            label: formatArchiveLabel({
              isLoading: isArchiving,
              status: content.status,
            }),
            onClick: handleArchive,
          }
        : undefined,
      onDelete: onDeleteAction ? () => setDeleteDialogOpen(true) : undefined,
      viewUrl,
    }),
    setDeleteDialogOpen,
  };
}
