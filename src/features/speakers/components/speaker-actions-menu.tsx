'use client';

import type { Speaker, SpeakerId } from '@/features/speakers/types';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  ActionsGroup,
  DeleteBlockedDialog,
  DeleteConfirmDialog,
  getEntityMenuItems,
} from '@/components/actions-group';
import { toastManager } from '@/components/ui/primitives/toast';
import { deleteSpeakerAction } from '@/features/speakers/actions/delete-speaker';
import { formatErrorMessage } from '@/services/errors';
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
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const speakerId = speaker._id as SpeakerId;
  const fullName = `${speaker.firstName} ${speaker.lastName}`;
  const contentCount = talkCount + clipCount;

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteSpeakerAction(speakerId);

      if (result.success) {
        toastManager.add({ title: 'Speaker deleted', type: 'success' });
        setDeleteDialogOpen(false);
        router.refresh();
      } else {
        toastManager.add({
          description: result.errors?.root ?? 'An error occurred',
          title: 'Failed to delete speaker',
          type: 'error',
        });
      }
    } catch (error: unknown) {
      toastManager.add({
        description: formatErrorMessage(error),
        title: 'Failed to delete speaker',
        type: 'error',
      });
    }

    setIsDeleting(false);
  };

  const parts: string[] = [];
  if (talkCount > 0) {
    parts.push(`${talkCount} ${pluralize(talkCount, 'talk', 'talks')}`);
  }
  if (clipCount > 0) {
    parts.push(`${clipCount} ${pluralize(clipCount, 'clip', 'clips')}`);
  }
  const blockReason = `This speaker has ${parts.join(' and ')} associated. Remove all associated content before deleting.`;

  const menuItems = getEntityMenuItems({
    onDelete: () => setDeleteDialogOpen(true),
    viewUrl,
  });

  return (
    <>
      <ActionsGroup disabled={isDeleting} menuItems={menuItems} />

      {contentCount > 0 ? (
        <DeleteBlockedDialog
          blockReason={blockReason}
          name={fullName}
          onOpenChange={setDeleteDialogOpen}
          open={deleteDialogOpen}
        />
      ) : (
        <DeleteConfirmDialog
          isDeleting={isDeleting}
          name={fullName}
          onDelete={handleDelete}
          onOpenChange={setDeleteDialogOpen}
          open={deleteDialogOpen}
        />
      )}
    </>
  );
}
