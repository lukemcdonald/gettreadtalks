import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { getHoverItems, ManageRow } from '@/components/manage-table';
import { getSpeakerName } from '@/features/speakers/utils';
import { TalkActionsMenu } from '@/features/talks/components/talk-actions-menu';
import { buildTalkPath } from '@/features/talks/utils';
import { buildEntityEditPath } from '@/lib/entities/paths';

interface TalksTableRowProps {
  talk: TalkWithSpeakerAndTopics;
}

export function TalksTableRow({ talk }: TalksTableRowProps) {
  const editPath = buildEntityEditPath('talks', talk._id);
  const publicPath =
    talk.status === 'published' && talk.speaker
      ? buildTalkPath(talk)
      : undefined;

  return (
    <ManageRow
      actions={<TalkActionsMenu talk={talk} talkUrl={publicPath} />}
      editHref={editPath}
      hoverItems={getHoverItems([
        { label: 'Scripture', value: talk.scripture },
        { label: 'Topics', value: talk.topicSlugs.join(', ') },
        { label: 'Collection', value: talk.collectionTitle },
        { label: 'Featured clip', value: talk.featuredClipTitle },
        { label: 'Featured', value: talk.featured },
      ])}
      status={talk.status}
      subtitle={talk.speaker ? getSpeakerName(talk.speaker) : undefined}
      title={talk.title}
    />
  );
}
