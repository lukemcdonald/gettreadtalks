'use client';

import type { AdminClip } from '@/features/clips/types';

import { useRouter } from 'next/navigation';

import { ContentActionsGroup } from '@/components/actions-group';
import { useArchiveClip } from '@/features/clips/hooks/use-archive-clip';
import { useDestroyClip } from '@/features/clips/hooks/use-destroy-clip';
import { buildAdminListPath } from '@/lib/entities/paths';

interface ClipActionsMenuProps {
  clip: AdminClip;
  clipUrl?: string;
}

export function ClipActionsMenu({ clip, clipUrl }: ClipActionsMenuProps) {
  const clipId = clip._id;
  const router = useRouter();

  const { archiveClip } = useArchiveClip();
  const { destroyClip } = useDestroyClip({
    onSuccess: () => {
      router.push(buildAdminListPath('clips'));
    },
  });

  async function handleArchive() {
    return await archiveClip(clipId);
  }

  async function handleDelete() {
    return await destroyClip(clipId);
  }

  return (
    <ContentActionsGroup
      content={clip}
      contentType="clip"
      listUrl={buildAdminListPath('clips')}
      onArchiveAction={handleArchive}
      onDeleteAction={handleDelete}
      viewUrl={clipUrl}
    />
  );
}
