import type { Speaker } from '@/features/speakers/types';

import { Badge, TableCell, TableRow } from '@/components/ui';
import { SpeakerActionsMenu } from '@/features/speakers/components/speaker-actions-menu';
import { pluralize } from '@/utils';

interface SpeakersTableRowProps {
  clipCount: number;
  speaker: Speaker;
  talkCount: number;
}

function CountBadge({ count, label }: { count: number; label: string }) {
  return (
    <Badge variant="secondary">
      {count === 0 ? `No ${label}s` : `${count} ${pluralize(count, label, `${label}s`)}`}
    </Badge>
  );
}

export function SpeakersTableRow({ clipCount, speaker, talkCount }: SpeakersTableRowProps) {
  const fullName = `${speaker.firstName} ${speaker.lastName}`;

  return (
    <TableRow>
      <TableCell className="whitespace-normal font-medium">{fullName}</TableCell>
      <TableCell className="w-[120px]">
        <CountBadge count={talkCount} label="talk" />
      </TableCell>
      <TableCell className="w-[120px]">
        <CountBadge count={clipCount} label="clip" />
      </TableCell>
      <TableCell className="w-px text-right">
        <SpeakerActionsMenu clipCount={clipCount} speaker={speaker} talkCount={talkCount} />
      </TableCell>
    </TableRow>
  );
}
