'use client';

import type { ContentActionsGroupProps } from './actions-group.types';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { toastManager } from '@/components/ui/primitives/toast';
import { formatArchiveLabel } from '@/lib/entities/utils';
import { formatErrorMessage } from '@/services/errors';
import { capitalize } from '@/utils';

import { getContentMenuItems } from './get-content-menu-items';
import { useEntityDeleteConfirm } from './use-entity-delete-confirm';

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
    useEntityDeleteConfirm({
      deleteAction: onDeleteAction,
      failureTitle: `Failed to delete ${contentType}`,
      id: content._id,
      listUrl,
      successTitle: `${capitalize(contentType)} deleted`,
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
