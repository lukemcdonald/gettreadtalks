'use client';

import type { ActionsGroupMenuItem, ContentActionsGroupProps } from './actions-group.types';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

export function ContentActionsGroup({
  additionalActions = [],
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
        type: 'success',
        title: `${capitalize(contentType)} ${isArchived ? 'unarchived' : 'archived'}`,
      });
      router.refresh();
    } catch (error: unknown) {
      toastManager.add({
        type: 'error',
        title: `Failed to archive ${contentType}`,
        description: getErrorMessage(error),
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
        type: 'error',
        title: `Failed to delete ${contentType}`,
        description: getErrorMessage(error),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const menuItems: ActionsGroupMenuItem[] = [
    ...(viewUrl ? [{ label: 'View', href: viewUrl }] : []),
    ...(editUrl ? [{ label: 'Edit', href: editUrl }] : []),
    ...(onArchiveAction
      ? [{ label: archiveLabel, onClick: handleArchive, disabled: isArchiving, separator: true }]
      : []),
    ...additionalActions,
    ...(onDeleteAction
      ? [
          {
            label: 'Delete',
            onClick: () => setDeleteDialogOpen(true),
            variant: 'destructive' as const,
            separator: !onArchiveAction && additionalActions.length === 0,
          },
        ]
      : []),
  ];

  const defaultPrimaryAction = editUrl ? { label: 'Edit', href: editUrl } : undefined;

  return (
    <>
      <ActionsGroup
        disabled={isDisabled}
        menuItems={menuItems}
        primaryAction={primaryAction || defaultPrimaryAction}
      />

      {!!onDeleteAction && (
        <AlertDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete {content.title ? `"${content.title}"` : `this ${contentType}`}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the {contentType} and all
                associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogClose render={<Button variant="outline" />}>Cancel</AlertDialogClose>
              <Button disabled={isDeleting} onClick={handleDelete} variant="destructive">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
