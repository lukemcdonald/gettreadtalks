import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import Link from 'next/link';

import { StatusPopover } from '@/components/status-popover';
import { TableCell, TableRow } from '@/components/ui';
import { getSpeakerName } from '@/features/speakers';
import { TalkActionsMenu } from '@/features/talks/components/talk-actions-menu';

interface TalksTableRowProps {
  talk: TalkWithSpeakerAndTopics;
}

export function TalksTableRow({ talk }: TalksTableRowProps) {
  const talkUrl = talk.speaker ? `/talks/${talk.speaker.slug}/${talk.slug}` : '';

  return (
    <TableRow key={talk._id}>
      <TableCell className="w-[40px]">
        <StatusPopover
          createdAt={talk._creationTime}
          publishedAt={talk.publishedAt}
          status={talk.status}
          updatedAt={talk.updatedAt}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Link className="line-clamp-2 block hover:underline" href={talkUrl}>
              {talk.title}
            </Link>
            {!!talk.speaker && (
              <p className="truncate text-muted-foreground text-sm">
                by {getSpeakerName(talk.speaker)}
              </p>
            )}
          </div>

          <TalkActionsMenu talk={talk} talkUrl={talkUrl} />
        </div>
      </TableCell>
    </TableRow>
  );
}
