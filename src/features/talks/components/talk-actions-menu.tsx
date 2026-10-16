'use client';

import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { useRouter } from 'next/navigation';

import { ContentActionsGroup } from '@/components/actions-group';
import { useArchiveTalk } from '@/features/talks/hooks/use-archive-talk';
import { useDestroyTalk } from '@/features/talks/hooks/use-destroy-talk';
import { getAdminListPath } from '@/lib/entities/paths';

interface TalkActionsMenuProps {
  talk: TalkWithSpeakerAndTopics;
  talkUrl?: string;
}

export function TalkActionsMenu({ talk, talkUrl }: TalkActionsMenuProps) {
  const talkId = talk._id;
  const router = useRouter();

  const { mutateAsync: archiveTalk } = useArchiveTalk();
  const { mutateAsync: destroyTalk } = useDestroyTalk({
    onSuccess: () => router.push('/talks'),
  });

  const handleArchive = async () => {
    await archiveTalk({ talkId });
  };

  const handleDelete = async () => {
    await destroyTalk({ talkId });
  };

  return (
    <ContentActionsGroup
      content={talk}
      contentType="talk"
      listUrl={getAdminListPath('talks')}
      onArchiveAction={handleArchive}
      onDeleteAction={handleDelete}
      viewUrl={talkUrl}
    />
  );
}
