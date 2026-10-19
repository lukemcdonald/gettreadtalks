import type { ManageStatus } from '@/components/manage-table';
import type { Speaker } from '@/features/speakers/types';

import {
  getHoverItems,
  ManageCountCell,
  ManageRow,
} from '@/components/manage-table';
import { SpeakerActionsMenu } from '@/features/speakers/components/speaker-actions-menu';
import { SpeakerAvatar } from '@/features/speakers/components/speaker-avatar';
import { buildSpeakerPath, getSpeakerName } from '@/features/speakers/utils';
import { buildEntityEditPath } from '@/lib/entities/paths';

interface SpeakersTableRowProps {
  clipCount: number;
  speaker: Speaker;
  status: ManageStatus;
  talkCount: number;
}

export function SpeakersTableRow({
  clipCount,
  speaker,
  status,
  talkCount,
}: SpeakersTableRowProps) {
  const editPath = buildEntityEditPath('speakers', speaker._id);
  const fullName = getSpeakerName(speaker);
  const publicPath =
    status === 'published' ? buildSpeakerPath(speaker) : undefined;

  return (
    <ManageRow
      actions={
        <SpeakerActionsMenu
          clipCount={clipCount}
          speaker={speaker}
          talkCount={talkCount}
          viewUrl={publicPath}
        />
      }
      editHref={editPath}
      hoverItems={getHoverItems([
        { label: 'Talks', value: talkCount },
        { label: 'Featured', value: speaker.featured },
      ])}
      leading={<SpeakerAvatar size="xs" speaker={speaker} />}
      status={status}
      subtitle={speaker.ministry}
      title={fullName}
    >
      <ManageCountCell>{talkCount}</ManageCountCell>
    </ManageRow>
  );
}
