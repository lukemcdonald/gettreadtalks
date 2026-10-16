import type { ManageStatus } from '@/app/manage/_components/manage-table';
import type { Speaker } from '@/features/speakers/types';

import {
  ManageCountCell,
  ManageRow,
} from '@/app/manage/_components/manage-table';
import { SpeakerActionsMenu } from '@/features/speakers/components/speaker-actions-menu';
import { SpeakerAvatar } from '@/features/speakers/components/speaker-avatar';
import { getSpeakerName, getSpeakerUrl } from '@/features/speakers/utils';
import { getEntityEditPath } from '@/lib/entities/paths';

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
  const editPath = getEntityEditPath('speakers', speaker._id);
  const fullName = getSpeakerName(speaker);
  const publicPath =
    status === 'published' ? getSpeakerUrl(speaker.slug) : undefined;

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
      leading={<SpeakerAvatar size="xs" speaker={speaker} />}
      status={status}
      title={fullName}
      updatedAt={speaker.updatedAt ?? speaker._creationTime}
    >
      <ManageCountCell>{talkCount}</ManageCountCell>
    </ManageRow>
  );
}
