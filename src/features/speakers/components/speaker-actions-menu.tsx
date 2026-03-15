'use client';

import type { Speaker, SpeakerId } from '@/features/speakers/types';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { ActionsGroup, DeleteGuardDialog } from '@/components/actions-group';
import { toastManager } from '@/components/ui/primitives/toast';
import { destroySpeakerAction } from '@/features/speakers/actions/destroy-speaker';
import { getErrorMessage } from '@/services/errors';

interface SpeakerActionsMenuProps {
  clipCount: number;
  speaker: Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'slug'>;
  talkCount: number;
}

export function SpeakerActionsMenu({ clipCount, speaker, talkCount }: SpeakerActionsMenuProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const speakerId = speaker._id as SpeakerId;
  const fullName = `${speaker.firstName} ${speaker.lastName}`;
  const contentCount = talkCount + clipCount;

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await destroySpeakerAction(speakerId);

      if (!result.success) {
        toastManager.add({
          type: 'error',
          title: 'Failed to delete speaker',
          description: result.errors?.root ?? 'An error occurred',
        });
        return;
      }

      toastManager.add({ title: 'Speaker deleted', type: 'success' });
      setDeleteDialogOpen(false);
      router.refresh();
    } catch (error: unknown) {
      toastManager.add({
        type: 'error',
        title: 'Failed to delete speaker',
        description: getErrorMessage(error),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const parts: string[] = [];
  if (talkCount > 0) {
    parts.push(`${talkCount} ${talkCount === 1 ? 'talk' : 'talks'}`);
  }
  if (clipCount > 0) {
    parts.push(`${clipCount} ${clipCount === 1 ? 'clip' : 'clips'}`);
  }
  const blockReason = `This speaker has ${parts.join(' and ')} associated. Remove all associated content before deleting.`;

  const menuItems = [
    { href: `/speakers/${speaker.slug}`, label: 'View' },
    { href: `/speakers/edit/${speakerId}`, label: 'Edit' },
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

      <DeleteGuardDialog
        blockReason={blockReason}
        count={contentCount}
        isDeleting={isDeleting}
        name={fullName}
        onDelete={handleDelete}
        onOpenChange={setDeleteDialogOpen}
        open={deleteDialogOpen}
      />
    </>
  );
}
