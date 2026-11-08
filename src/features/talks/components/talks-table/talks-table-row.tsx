import type { ManageStatus } from '@/components/manage-table';
import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';
import type { ReactNode } from 'react';

import { getHoverItems, ManageRow } from '@/components/manage-table';
import { getSpeakerName } from '@/features/speakers/utils';
import { TalkActionsMenu } from '@/features/talks/components/talk-actions-menu';
import { buildTalkEditPath, buildTalkPath } from '@/features/talks/utils';

interface TalksTableRowProps {
  actions?: ReactNode;
  editHref?: string;
  status?: ManageStatus;
  talk: TalkWithSpeakerAndTopics;
}

export function TalksTableRow({
  actions,
  editHref,
  status,
  talk,
}: TalksTableRowProps) {
  const publicPath =
    talk.status === 'published' && talk.speaker
      ? buildTalkPath(talk)
      : undefined;

  return (
    <ManageRow
      actions={
        actions === undefined ? (
          <TalkActionsMenu talk={talk} talkUrl={publicPath} />
        ) : (
          actions
        )
      }
      editHref={editHref ?? buildTalkEditPath(talk._id)}
      hoverItems={getHoverItems([
        { label: 'Scripture', value: talk.scripture },
        { label: 'Topics', value: talk.topicSlugs.join(', ') },
        { label: 'Collection', value: talk.collectionTitle },
        { label: 'Featured clip', value: talk.featuredClipTitle },
        { label: 'Featured', value: talk.featured },
      ])}
      status={status ?? talk.status}
      subtitle={talk.speaker ? getSpeakerName(talk.speaker) : undefined}
      title={talk.title}
    />
  );
}
