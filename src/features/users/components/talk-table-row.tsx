import type { ReactNode } from 'react';

import { TableCell, TableRow } from '@/components/ui';
import { Link } from '@/components/ui/link';
import { getSpeakerName } from '@/features/speakers/utils';
import { TalkCardSubtitle } from '@/features/talks/components/talk-card-subtitle';

interface TalkTableRowProps {
  action: ReactNode;
  href: string;
  scripture?: string;
  speaker?: { firstName: string; lastName: string } | null;
  title: string;
}

export function TalkTableRow({
  action,
  href,
  scripture,
  speaker,
  title,
}: TalkTableRowProps) {
  const speakerName = getSpeakerName(speaker);

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Link className="line-clamp-2 block hover:underline" href={href}>
              {title}
            </Link>
            {!!(scripture || speakerName) && (
              <p className="text-muted-foreground min-w-0 text-sm">
                <TalkCardSubtitle
                  scripture={scripture}
                  speakerName={speakerName}
                />
              </p>
            )}
          </div>
          {action}
        </div>
      </TableCell>
    </TableRow>
  );
}
