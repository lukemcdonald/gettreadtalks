import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { ManageRow } from '@/app/manage/_components/manage-table';
import { getSpeakerName } from '@/features/speakers/utils';
import { TalkActionsMenu } from '@/features/talks/components/talk-actions-menu';
import { getTalkUrl } from '@/features/talks/utils';
import { getEntityEditPath } from '@/lib/entities/paths';

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
    <ManageRow
      actions={<TalkActionsMenu talk={talk} talkUrl={publicPath} />}
      editHref={editPath}
      status={talk.status}
      subtitle={talk.speaker ? getSpeakerName(talk.speaker) : undefined}
      title={talk.title}
      updatedAt={talk.updatedAt ?? talk._creationTime}
    />
  );
}
