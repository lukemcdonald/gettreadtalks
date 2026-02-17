import type { ReactNode } from 'react';

import { Link, TableCell, TableRow } from '@/components/ui';

interface TalkTableRowProps {
  action: ReactNode;
  href: string;
  speaker?: { firstName: string; lastName: string } | null;
  title: string;
}

export function TalkTableRow({ action, href, speaker, title }: TalkTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Link className="line-clamp-2 block hover:underline" href={href}>
              {title}
            </Link>
            {speaker && (
              <p className="truncate text-muted-foreground text-sm">
                {speaker.firstName} {speaker.lastName}
              </p>
            )}
          </div>
          {action}
        </div>
      </TableCell>
    </TableRow>
  );
}
