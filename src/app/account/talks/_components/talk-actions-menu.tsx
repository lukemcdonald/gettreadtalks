'use client';

import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { ContentActionsGroup } from '@/components/actions-group';
import { useArchiveTalk, useDestroyTalk } from '@/features/talks/hooks';

type TalkActionsMenuProps = {
  talk: TalkWithSpeakerAndTopics;
  talkUrl: string;
};

export function TalkActionsMenu({ talk, talkUrl }: TalkActionsMenuProps) {
  const archiveTalk = useArchiveTalk();
  const destroyTalk = useDestroyTalk();

  const handleArchive = async () => {
    await archiveTalk.mutateAsync({ id: talk._id });
  };

  const handleDelete = async () => {
    await destroyTalk.mutateAsync({ id: talk._id });
  };

  return (
    <ContentActionsGroup
      content={talk}
      contentType="talk"
      editUrl={`${talkUrl}/edit`}
      listUrl="/account/talks"
      onArchive={handleArchive}
      onDelete={handleDelete}
      viewUrl={talkUrl}
    />
  );
}
