import type { Speaker } from '@/features/speakers/types';

import { CountBadge } from '@/components/count-badge';
import { TableCell, TableRow } from '@/components/ui';
import { SpeakerActionsMenu } from '@/features/speakers/components/speaker-actions-menu';

interface SpeakersTableRowProps {
  clipCount: number;
  speaker: Speaker;
  talkCount: number;
}

export function SpeakersTableRow({
  clipCount,
  speaker,
  talkCount,
}: SpeakersTableRowProps) {
  const fullName = `${speaker.firstName} ${speaker.lastName}`;

  return (
    <TableRow>
      <TableCell className="font-medium whitespace-normal">
        {fullName}
      </TableCell>
      <TableCell className="w-[120px]">
        <CountBadge count={talkCount} label="talk" />
      </TableCell>
      <TableCell className="w-[120px]">
        <CountBadge count={clipCount} label="clip" />
      </TableCell>
      <TableCell className="w-px text-right">
        <SpeakerActionsMenu
          clipCount={clipCount}
          speaker={speaker}
          talkCount={talkCount}
        />
      </TableCell>
    </TableRow>
  );
}
