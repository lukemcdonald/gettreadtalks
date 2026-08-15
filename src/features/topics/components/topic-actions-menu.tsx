'use client';

import type { Topic, TopicId } from '@/features/topics/types';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  ActionsGroup,
  DeleteBlockedDialog,
  DeleteConfirmDialog,
} from '@/components/actions-group';
import { toastManager } from '@/components/ui/primitives/toast';
import { destroyTopicAction } from '@/features/topics/actions/destroy-topic';
import { getErrorMessage } from '@/services/errors';
import { pluralize } from '@/utils';

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
          description: result.errors?.root ?? 'An error occurred',
          title: 'Failed to delete topic',
          type: 'error',
        });
        return;
      }

      toastManager.add({ title: 'Topic deleted', type: 'success' });
      setDeleteDialogOpen(false);
      router.refresh();
    } catch (error: unknown) {
      toastManager.add({
        description: getErrorMessage(error),
        title: 'Failed to delete topic',
        type: 'error',
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

      {talkCount > 0 ? (
        <DeleteBlockedDialog
          blockReason={`This topic has ${talkCount} ${pluralize(talkCount, 'talk', 'talks')} associated. Remove all talks from this topic before deleting.`}
          name={topic.title}
          onOpenChange={setDeleteDialogOpen}
          open={deleteDialogOpen}
        />
      ) : (
        <DeleteConfirmDialog
          isDeleting={isDeleting}
          name={topic.title}
          onDelete={handleDelete}
          onOpenChange={setDeleteDialogOpen}
          open={deleteDialogOpen}
        />
      )}
    </>
  );
}
