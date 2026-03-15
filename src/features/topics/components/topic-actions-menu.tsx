'use client';

import type { Topic, TopicId } from '@/features/topics/types';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { ActionsGroup } from '@/components/actions-group';
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
import { destroyTopicAction } from '@/features/topics/actions/destroy-topic';
import { getErrorMessage } from '@/services/errors';

interface TopicActionsMenuProps {
  talkCount: number;
  topic: Pick<Topic, '_id' | 'slug' | 'title'>;
}

export function TopicActionsMenu({ talkCount, topic }: TopicActionsMenuProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const topicId = topic._id as TopicId;

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await destroyTopicAction(topicId);

      if (!result.success) {
        toastManager.add({
          type: 'error',
          title: 'Failed to delete topic',
          description: result.errors?.root ?? 'An error occurred',
        });
        return;
      }

      toastManager.add({ title: 'Topic deleted', type: 'success' });
      setDeleteDialogOpen(false);
      router.refresh();
    } catch (error: unknown) {
      toastManager.add({
        type: 'error',
        title: 'Failed to delete topic',
        description: getErrorMessage(error),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const menuItems = [
    { hidden: talkCount === 0, href: `/topics/${topic.slug}`, label: 'View' },
    { href: `/topics/edit/${topicId}`, label: 'Edit' },
    {
      label: 'Delete',
      onClick: () => setDeleteDialogOpen(true),
      separator: true,
      variant: 'destructive' as const,
    },
  ];

  return (
    <>
      <ActionsGroup disabled={isDeleting} menuItems={menuItems} />

      <AlertDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
        <AlertDialogContent>
          {talkCount > 0 ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Cannot delete &quot;{topic.title}&quot;</AlertDialogTitle>
                <AlertDialogDescription>
                  This topic has {talkCount} {talkCount === 1 ? 'talk' : 'talks'} associated. Remove
                  all talks from this topic before deleting.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogClose render={<Button variant="outline" />}>Close</AlertDialogClose>
              </AlertDialogFooter>
            </>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete &quot;{topic.title}&quot;?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogClose render={<Button variant="outline" />}>Cancel</AlertDialogClose>
                <Button disabled={isDeleting} onClick={handleDelete} variant="destructive">
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
