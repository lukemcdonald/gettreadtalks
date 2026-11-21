'use client';

import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { useRouter } from 'next/navigation';

import { ContentActionsGroup } from '@/components/actions-group';
import { useArchiveTalk } from '@/features/talks/hooks/use-archive-talk';
import { useDestroyTalk } from '@/features/talks/hooks/use-destroy-talk';
import { buildTalksPath } from '@/features/talks/utils';
import { buildAdminListPath } from '@/lib/entities/paths';

interface TalkActionsMenuProps {
  talk: TalkWithSpeakerAndTopics;
  talkUrl?: string;
}

export function TalkActionsMenu({ talk, talkUrl }: TalkActionsMenuProps) {
  const talkId = talk._id;
  const router = useRouter();

  const { archiveTalk } = useArchiveTalk();
  const { destroyTalk } = useDestroyTalk({
    onSuccess: () => {
      router.push(buildTalksPath());
    },
  });

  async function handleArchive() {
    return await archiveTalk(talkId);
  }

  async function handleDelete() {
    return await destroyTalk(talkId);
  }

  return (
    <ContentActionsGroup
      content={talk}
      contentType="talk"
      listUrl={buildAdminListPath('talks')}
      onArchiveAction={handleArchive}
      onDeleteAction={handleDelete}
      viewUrl={talkUrl}
    />
  );
}
