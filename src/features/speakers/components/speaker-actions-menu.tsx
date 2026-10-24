'use client';

import type { Speaker, SpeakerId } from '@/features/speakers/types';

import {
  ActionsGroup,
  DeleteBlockedDialog,
  DeleteConfirmDialog,
  useEntityDeleteConfirm,
} from '@/components/actions-group';
import { deleteSpeakerAction } from '@/features/speakers/actions/delete-speaker';
import { pluralize } from '@/utils';

interface SpeakerActionsMenuProps {
  clipCount: number;
  speaker: Pick<Speaker, '_id' | 'firstName' | 'lastName'>;
  talkCount: number;
  viewUrl?: string;
}

export function SpeakerActionsMenu({
  clipCount,
  speaker,
  talkCount,
  viewUrl,
}: SpeakerActionsMenuProps) {
  const {
    deleteDialogOpen,
    handleDelete,
    isDeleting,
    menuItems,
    setDeleteDialogOpen,
  } = useEntityDeleteConfirm({
    deleteAction: deleteSpeakerAction,
    failureTitle: 'Failed to delete speaker',
    id: speaker._id as SpeakerId,
    successTitle: 'Speaker deleted',
    viewUrl,
  });

  const parts: string[] = [];
  if (talkCount > 0) {
    parts.push(`${talkCount} ${pluralize(talkCount, 'talk', 'talks')}`);
  }
  if (clipCount > 0) {
    parts.push(`${clipCount} ${pluralize(clipCount, 'clip', 'clips')}`);
  }

  return (
    <>
      <ActionsGroup disabled={isDeleting} menuItems={menuItems} />

      {talkCount + clipCount > 0 ? (
        <DeleteBlockedDialog
          blockReason={`This speaker has ${parts.join(' and ')} associated. Remove all associated content before deleting.`}
          name={`${speaker.firstName} ${speaker.lastName}`}
          onOpenChange={setDeleteDialogOpen}
          open={deleteDialogOpen}
        />
      ) : (
        <DeleteConfirmDialog
          isDeleting={isDeleting}
          name={`${speaker.firstName} ${speaker.lastName}`}
          onDelete={handleDelete}
          onOpenChange={setDeleteDialogOpen}
          open={deleteDialogOpen}
        />
      )}
    </>
  );
}
