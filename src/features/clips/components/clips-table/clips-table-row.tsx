import type { ClipWithSpeaker } from '@/features/clips/types';

import Link from 'next/link';

import { StatusPopover } from '@/components/status-popover';
import { TableCell, TableRow } from '@/components/ui';
import { ClipActionsMenu } from '@/features/clips/components/clip-actions-menu';
import { getSpeakerName } from '@/features/speakers/utils';

interface ClipsTableRowProps {
  clip: ClipWithSpeaker;
}

export function ClipsTableRow({ clip }: ClipsTableRowProps) {
  const clipUrl = `/clips/${clip.slug}`;

  return (
    <TableRow>
      <TableCell className="w-[40px]">
        <StatusPopover
          createdAt={clip._creationTime}
          publishedAt={clip.publishedAt}
          status={clip.status}
          updatedAt={clip.updatedAt}
        />
      </TableCell>
      <TableCell className="whitespace-normal">
        <Link className="line-clamp-2 block hover:underline" href={clipUrl}>
          {clip.title}
        </Link>
        {!!clip.speaker && (
          <p className="truncate text-muted-foreground text-sm">
            by {getSpeakerName(clip.speaker)}
          </p>
        )}
      </TableCell>
      <TableCell className="w-px text-right">
        <ClipActionsMenu clip={clip} clipUrl={clipUrl} />
      </TableCell>
    </TableRow>
  );
}
