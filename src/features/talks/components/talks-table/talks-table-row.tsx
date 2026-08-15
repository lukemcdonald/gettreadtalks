import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { ContentTableRow } from '@/components/content-table-row';
import { getSpeakerName } from '@/features/speakers/utils';
import { TalkActionsMenu } from '@/features/talks/components/talk-actions-menu';

interface TalksTableRowProps {
  talk: TalkWithSpeakerAndTopics;
}

export function TalksTableRow({ talk }: TalksTableRowProps) {
  const talkUrl = talk.speaker
    ? `/talks/${talk.speaker.slug}/${talk.slug}`
    : '';

  return (
    <ContentTableRow
      actionsMenu={<TalkActionsMenu talk={talk} talkUrl={talkUrl} />}
      createdAt={talk._creationTime}
      href={talkUrl}
      publishedAt={talk.publishedAt}
      speakerName={talk.speaker ? getSpeakerName(talk.speaker) : undefined}
      status={talk.status}
      title={talk.title}
      updatedAt={talk.updatedAt}
    />
  );
}
