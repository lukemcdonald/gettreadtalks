'use client';

import type { ClipWithSpeaker } from '@/features/clips/types';

import { useRouter } from 'next/navigation';

import { ContentActionsGroup } from '@/components/actions-group';
import { useArchiveClip } from '@/features/clips/hooks/use-archive-clip';
import { useDestroyClip } from '@/features/clips/hooks/use-destroy-clip';

interface ClipActionsMenuProps {
  clip: ClipWithSpeaker;
  clipUrl: string;
}

export function ClipActionsMenu({ clip, clipUrl }: ClipActionsMenuProps) {
  const clipId = clip._id;
  const router = useRouter();

  const { mutateAsync: archiveClip } = useArchiveClip({
    onSuccess: () => router.push('/clips'),
  });
  const { mutateAsync: destroyClip } = useDestroyClip({
    onSuccess: () => router.push('/account/clips'),
  });

  const handleArchive = async () => {
    await archiveClip({ clipId });
  };

  const handleDelete = async () => {
    await destroyClip({ clipId });
  };

  return (
    <ContentActionsGroup
      content={clip}
      contentType="clip"
      editUrl={`/clips/edit/${clipId}`}
      listUrl="/account/clips"
      onArchiveAction={handleArchive}
      onDeleteAction={handleDelete}
      viewUrl={clipUrl}
    />
  );
}
