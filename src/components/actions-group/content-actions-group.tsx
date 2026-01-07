'use client';

import type { Id } from '@/convex/_generated/dataModel';
import type { StatusType } from '@/convex/lib/validators/shared';
import type { ActionsGroupMenuItem } from './actions-group';

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
import { ActionsGroup } from './actions-group';

export type ContentActionsGroupProps = {
  content: {
    _id: Id<'talks'> | Id<'clips'> | Id<'collections'> | Id<'speakers'> | Id<'topics'>;
    status?: StatusType;
    title?: string;
  };
  contentType: 'talk' | 'clip' | 'collection' | 'speaker' | 'topic';
  editUrl: string;
  viewUrl?: string;
  listUrl?: string;
  onArchive?: (id: ContentActionsGroupProps['content']['_id']) => Promise<void>;
  onDelete?: (id: ContentActionsGroupProps['content']['_id']) => Promise<void>;
  additionalActions?: ActionsGroupMenuItem[];
};

export function ContentActionsGroup({
  content,
  contentType,
  editUrl,
  viewUrl,
  listUrl,
  onArchive,
  onDelete,
  additionalActions = [],
}: ContentActionsGroupProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isArchived = content.status === 'archived';
  const isLoading = isArchiving || isDeleting;

  let archiveLabel = 'Archive';
  if (isArchiving) {
    archiveLabel = 'Archiving...';
  } else if (isArchived) {
    archiveLabel = 'Unarchive';
  }

  const handleEdit = () => {
    router.push(editUrl);
  };

  const handleView = () => {
    if (viewUrl) {
      router.push(viewUrl);
    }
  };

  const handleArchive = async () => {
    if (!onArchive) {
      return;
    }

    setIsArchiving(true);
    try {
      await onArchive(content._id);
      toastManager.add({
        title: isArchived
          ? `${capitalize(contentType)} unarchived`
          : `${capitalize(contentType)} archived`,
        type: 'success',
      });
      router.refresh();
    } catch (error: unknown) {
      toastManager.add({
        title: `Failed to archive ${contentType}`,
        description: error instanceof Error ? error.message : 'An error occurred',
        type: 'error',
      });
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(content._id);
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
        title: `Failed to delete ${contentType}`,
        description: error instanceof Error ? error.message : 'An error occurred',
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const menuItems: ActionsGroupMenuItem[] = [
    ...(viewUrl
      ? [
          {
            label: `View ${capitalize(contentType)}`,
            onClick: handleView,
          },
        ]
      : []),
    {
      label: `Edit ${capitalize(contentType)}`,
      onClick: handleEdit,
    },
    ...(onArchive
      ? [
          {
            label: archiveLabel,
            onClick: handleArchive,
            disabled: isArchiving,
            separator: true,
          },
        ]
      : []),
    ...additionalActions,
    ...(onDelete
      ? [
          {
            label: 'Delete',
            onClick: () => setDeleteDialogOpen(true),
            variant: 'destructive' as const,
            separator: !onArchive && additionalActions.length === 0,
          },
        ]
      : []),
  ];

  return (
    <>
      <ActionsGroup
        disabled={isLoading}
        menuItems={menuItems}
        primaryAction={{
          label: 'Edit',
          onClick: handleEdit,
        }}
      />

      {!!onDelete && (
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

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
