import type { Speaker } from '@/features/speakers/types';
import type { Talk, TalkStudy } from '@/features/talks/types';

import { getHoverItems, ManageRow } from '@/components/manage-table';
import { getSpeakerName } from '@/features/speakers/utils';
import { TalkActionsMenu } from '@/features/talks/components/talk-actions-menu';
import { buildTalkPath } from '@/features/talks/utils';
import { buildEntityEditPath } from '@/lib/entities/paths';

interface StudiesTableRowProps {
  speaker: Speaker | null;
  study: TalkStudy;
  talk: Talk;
}

export function StudiesTableRow({
  speaker,
  study,
  talk,
}: StudiesTableRowProps) {
  const publicPath =
    talk.status === 'published' && speaker
      ? buildTalkPath({ speaker, slug: talk.slug })
      : undefined;

  return (
    <ManageRow
      actions={<TalkActionsMenu talk={talk} talkUrl={publicPath} />}
      editHref={buildEntityEditPath('talks', talk._id)}
      hoverItems={getHoverItems([{ label: 'Summary', value: study.summary }])}
      status={study.studyStatus}
      subtitle={speaker ? getSpeakerName(speaker) : undefined}
      title={talk.title}
    />
  );
}
