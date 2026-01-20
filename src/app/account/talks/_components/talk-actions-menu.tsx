'use client';

import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { useRouter } from 'next/navigation';

import { ContentActionsGroup } from '@/components/actions-group';
import { useArchiveTalk, useDestroyTalk } from '@/features/talks/hooks';

interface TalkActionsMenuProps {
  talk: TalkWithSpeakerAndTopics;
  talkUrl: string;
}

export function TalkActionsMenu({ talk, talkUrl }: TalkActionsMenuProps) {
  const router = useRouter();
  const archiveTalk = useArchiveTalk({ onSuccess: () => router.push('/talks') });
  const destroyTalk = useDestroyTalk({ onSuccess: () => router.push('/talks') });

  const handleArchive = async () => {
    await archiveTalk.mutateAsync({ talkId: talk._id });
  };

  const handleDelete = async () => {
    await destroyTalk.mutateAsync({ talkId: talk._id });
  };

  return (
    <ContentActionsGroup
      content={talk}
      contentType="talk"
      editUrl={`${talkUrl}/edit`}
      listUrl="/account/talks"
      onArchiveAction={handleArchive}
      onDeleteAction={handleDelete}
      viewUrl={talkUrl}
    />
  );
}
