import type { Speaker } from '@/features/speakers/types';

import { CountBadge } from '@/components/count-badge';
import { ManageEditButton } from '@/components/manage-edit-button';
import { TableCell, TableRow } from '@/components/ui';
import { Link } from '@/components/ui/link';
import { SpeakerActionsMenu } from '@/features/speakers/components/speaker-actions-menu';
import { getSpeakerName, getSpeakerUrl } from '@/features/speakers/utils';
import { getEntityEditPath, getManageTitleHref } from '@/lib/entities/paths';

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
  const editPath = getEntityEditPath('speakers', speaker._id);
  const fullName = getSpeakerName(speaker);
  const publicPath =
    talkCount > 0 || clipCount > 0 ? getSpeakerUrl(speaker.slug) : undefined;
  const href = getManageTitleHref({ editPath, publicPath });

  return (
    <TableRow>
      <TableCell className="font-medium whitespace-normal">
        <Link className="line-clamp-2 block hover:underline" href={href}>
          {fullName}
        </Link>
      </TableCell>
      <TableCell className="w-[120px]">
        <CountBadge count={talkCount} label="talk" />
      </TableCell>
      <TableCell className="w-[120px]">
        <CountBadge count={clipCount} label="clip" />
      </TableCell>
      <TableCell className="w-px text-right">
        <div className="flex items-center justify-end gap-1">
          <ManageEditButton
            entity="speakers"
            id={speaker._id}
            name={fullName}
          />
          <SpeakerActionsMenu
            clipCount={clipCount}
            speaker={speaker}
            talkCount={talkCount}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
