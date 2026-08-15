'use client';

import type {
  ActionsGroupMenuItem,
  ContentActionsGroupProps,
} from './actions-group.types';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui';
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/primitives/alert-dialog';
import { toastManager } from '@/components/ui/primitives/toast';
import { getArchiveLabel } from '@/lib/entities/utils';
import { getErrorMessage } from '@/services/errors';
import { capitalize } from '@/utils';

import { ActionsGroup } from './actions-group';

const EMPTY_ADDITIONAL_ACTIONS: ActionsGroupMenuItem[] = [];

export function ContentActionsGroup({
  additionalActions = EMPTY_ADDITIONAL_ACTIONS,
  content,
  contentType,
  disabled,
  editUrl,
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
    } finally {
      setIsArchiving(false);
    }
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
    } finally {
      setIsDeleting(false);
    }
  };

  const menuItems: ActionsGroupMenuItem[] = [
    ...(viewUrl ? [{ href: viewUrl, label: 'View' }] : []),
    ...(editUrl ? [{ href: editUrl, label: 'Edit' }] : []),
    ...(onArchiveAction
      ? [
          {
            disabled: isArchiving,
            label: archiveLabel,
            onClick: handleArchive,
            separator: true,
          },
        ]
      : []),
    ...additionalActions,
    ...(onDeleteAction
      ? [
          {
            label: 'Delete',
            onClick: () => setDeleteDialogOpen(true),
            separator: !onArchiveAction && additionalActions.length === 0,
            variant: 'destructive' as const,
          },
        ]
      : []),
  ];

  return (
    <>
      <ActionsGroup
        disabled={isDisabled}
        menuItems={menuItems}
        primaryAction={primaryAction}
      />

      {!!onDeleteAction && (
        <AlertDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete{' '}
                {content.title ? `"${content.title}"` : `this ${contentType}`}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the{' '}
                {contentType} and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogClose render={<Button variant="outline" />}>
                Cancel
              </AlertDialogClose>
              <Button
                loading={isDeleting}
                onClick={handleDelete}
                variant="destructive"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
