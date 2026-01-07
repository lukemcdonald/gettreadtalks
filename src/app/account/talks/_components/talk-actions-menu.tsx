'use client';

import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { useState } from 'react';
import {
  ArchiveIcon,
  ExternalLinkIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/primitives/alert-dialog';
import { toastManager } from '@/components/ui/primitives/toast';
import { useArchiveTalk, useDestroyTalk } from '@/features/talks/hooks';

type TalkActionsMenuProps = {
  talk: TalkWithSpeakerAndTopics;
  talkUrl: string;
};

export function TalkActionsMenu({ talk, talkUrl }: TalkActionsMenuProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const editUrl = `${talkUrl}/edit`;

  const archiveTalk = useArchiveTalk();
  const destroyTalk = useDestroyTalk();

  const isArchived = talk.status === 'archived';

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
    router.push(talkUrl);
  };

  const handleArchive = async () => {
    setIsArchiving(true);

    try {
      await archiveTalk.mutateAsync({ id: talk._id });
      toastManager.add({
        title: isArchived ? 'Talk unarchived' : 'Talk archived',
        type: 'success',
      });
      router.refresh();
    } catch (error: unknown) {
      toastManager.add({
        title: 'Failed to archive talk',
        description: error instanceof Error ? error.message : 'An error occurred',
        type: 'error',
      });
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await destroyTalk.mutateAsync({ id: talk._id });
      toastManager.add({
        title: 'Talk deleted',
        type: 'success',
      });
      setDeleteDialogOpen(false);
      router.push('/account/talks');
    } catch (error: unknown) {
      toastManager.add({
        title: 'Failed to delete talk',
        description: error instanceof Error ? error.message : 'An error occurred',
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button
          disabled={isArchiving || isDeleting}
          onClick={handleEdit}
          size="sm"
          variant="outline"
        >
          <PencilIcon className="size-4" />
          Edit
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
            disabled={isArchiving || isDeleting}
          >
            <MoreVerticalIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleView}>
              <ExternalLinkIcon className="mr-2 size-4" />
              View Talk
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>
              <PencilIcon className="mr-2 size-4" />
              Edit Talk
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={isArchiving} onClick={handleArchive}>
              <ArchiveIcon className="mr-2 size-4" />
              {archiveLabel}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <TrashIcon className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{talk.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the talk and all associated
              data.
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
    </>
  );
}
