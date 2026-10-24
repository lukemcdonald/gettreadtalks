'use client';

import type { ContentActionsGroupProps } from './actions-group.types';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { formatArchiveLabel } from '@/lib/entities/utils';

import { getContentMenuItems } from './get-content-menu-items';
import { runContentArchive, runContentDelete } from './run-content-action';

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
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isArchived = content.status === 'archived';
  const isLoading = isArchiving || isDeleting;

  const menuItems = getContentMenuItems({
    additionalActions,
    archive: onArchiveAction
      ? {
          disabled: isArchiving,
          label: formatArchiveLabel({
            isLoading: isArchiving,
            status: content.status,
          }),
          onClick: () =>
            runContentArchive({
              contentId: content._id,
              contentType,
              isArchived,
              onArchiveAction,
              router,
              setIsArchiving,
            }),
        }
      : undefined,
    onDelete: onDeleteAction ? () => setDeleteDialogOpen(true) : undefined,
    viewUrl,
  });

  return {
    deleteDialogOpen,
    handleDelete: () =>
      runContentDelete({
        contentId: content._id,
        contentType,
        listUrl,
        onDeleteAction,
        router,
        setDeleteDialogOpen,
        setIsDeleting,
      }),
    isDeleting,
    isDisabled: disabled || isLoading,
    menuItems,
    setDeleteDialogOpen,
  };
}
