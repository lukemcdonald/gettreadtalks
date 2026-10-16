'use client';

import type {
  ActionsGroupMenuItem,
  ContentActionsGroupProps,
} from './actions-group.types';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { toastManager } from '@/components/ui/primitives/toast';
import { getArchiveLabel } from '@/lib/entities/utils';
import { getErrorMessage } from '@/services/errors';
import { capitalize } from '@/utils';

import { ActionsGroup } from './actions-group';
import { ContentDeleteDialog } from './content-delete-dialog';
import { getContentMenuItems } from './get-content-menu-items';

const EMPTY_ADDITIONAL_ACTIONS: ActionsGroupMenuItem[] = [];

export function ContentActionsGroup({
  additionalActions = EMPTY_ADDITIONAL_ACTIONS,
  content,
  contentType,
  disabled,
  listUrl,
  onArchiveAction,
  onDeleteAction,
  primaryAction,
  viewUrl,
}: ContentActionsGroupProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isArchived = content.status === 'archived';
  const isLoading = isArchiving || isDeleting;
  const isDisabled = disabled || isLoading;

  const archiveLabel = getArchiveLabel({
    isLoading: isArchiving,
    status: content.status,
  });

  const handleArchive = async () => {
    if (!onArchiveAction) {
      return;
    }

    setIsArchiving(true);

    try {
      await onArchiveAction(content._id);
      toastManager.add({
        title: `${capitalize(contentType)} ${isArchived ? 'unarchived' : 'archived'}`,
        type: 'success',
      });
      router.refresh();
    } catch (error: unknown) {
      toastManager.add({
        description: getErrorMessage(error),
        title: `Failed to archive ${contentType}`,
        type: 'error',
      });
    }

    setIsArchiving(false);
  };

  const handleDelete = async () => {
    if (!onDeleteAction) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDeleteAction(content._id);

      toastManager.add({
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
      toastManager.add({
        description: getErrorMessage(error),
        title: `Failed to delete ${contentType}`,
        type: 'error',
      });
    }

    setIsDeleting(false);
  };

  const menuItems = getContentMenuItems({
    additionalActions,
    archive: onArchiveAction
      ? {
          disabled: isArchiving,
          label: archiveLabel,
          onClick: handleArchive,
        }
      : undefined,
    onDelete: onDeleteAction ? () => setDeleteDialogOpen(true) : undefined,
    viewUrl,
  });

  return (
    <>
      <ActionsGroup
        disabled={isDisabled}
        menuItems={menuItems}
        primaryAction={primaryAction}
      />
      {!!onDeleteAction && (
        <ContentDeleteDialog
          contentTitle={content.title}
          contentType={contentType}
          isDeleting={isDeleting}
          onDelete={handleDelete}
          onOpenChange={setDeleteDialogOpen}
          open={deleteDialogOpen}
        />
      )}
    </>
  );
}
