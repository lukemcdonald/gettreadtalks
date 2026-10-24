'use client';

import type { Topic, TopicId } from '@/features/topics/types';

import {
  ActionsGroup,
  DeleteBlockedDialog,
  DeleteConfirmDialog,
  useEntityDeleteConfirm,
} from '@/components/actions-group';
import { deleteTopicAction } from '@/features/topics/actions/delete-topic';
import { pluralize } from '@/utils';

interface TopicActionsMenuProps {
  talkCount: number;
  topic: Pick<Topic, '_id' | 'slug' | 'title'>;
  viewUrl?: string;
}

export function TopicActionsMenu({
  talkCount,
  topic,
  viewUrl,
}: TopicActionsMenuProps) {
  const {
    deleteDialogOpen,
    handleDelete,
    isDeleting,
    menuItems,
    setDeleteDialogOpen,
  } = useEntityDeleteConfirm({
    deleteAction: deleteTopicAction,
    failureTitle: 'Failed to delete topic',
    id: topic._id as TopicId,
    successTitle: 'Topic deleted',
    viewUrl,
  });

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
