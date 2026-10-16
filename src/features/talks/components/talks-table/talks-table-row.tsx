import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { ContentTableRow } from '@/components/content-table-row';
import { getSpeakerName } from '@/features/speakers/utils';
import { TalkActionsMenu } from '@/features/talks/components/talk-actions-menu';
import { getTalkUrl } from '@/features/talks/utils';
import { getEntityEditPath, getManageTitleHref } from '@/lib/entities/paths';

interface TalksTableRowProps {
  talk: TalkWithSpeakerAndTopics;
}

export function TalksTableRow({ talk }: TalksTableRowProps) {
  const editPath = getEntityEditPath('talks', talk._id);
  const publicPath =
    talk.status === 'published' && talk.speaker
      ? getTalkUrl(talk.speaker.slug, talk.slug)
      : undefined;

  return (
    <ContentTableRow
      actionsMenu={<TalkActionsMenu talk={talk} talkUrl={publicPath} />}
      createdAt={talk._creationTime}
      entity="talks"
      href={getManageTitleHref({ editPath, publicPath })}
      id={talk._id}
      publishedAt={talk.publishedAt}
      speakerName={talk.speaker ? getSpeakerName(talk.speaker) : undefined}
      status={talk.status}
      title={talk.title}
      updatedAt={talk.updatedAt}
    />
  );
}
