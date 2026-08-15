import type { StatusType } from '@/lib/entities/types';
import type { ReactNode } from 'react';

import Link from 'next/link';

import { StatusPopover } from '@/components/status-popover';
import { TableCell, TableRow } from '@/components/ui';

interface ContentTableRowProps {
  actionsMenu: ReactNode;
  createdAt: number;
  href: string;
  publishedAt?: number;
  speakerName?: string;
  status?: StatusType;
  title: string;
  updatedAt?: number;
}

export function ContentTableRow({
  actionsMenu,
  createdAt,
  href,
  publishedAt,
  speakerName,
  status,
  title,
  updatedAt,
}: ContentTableRowProps) {
  return (
    <TableRow>
      <TableCell className="w-[40px]">
        <StatusPopover
          createdAt={createdAt}
          publishedAt={publishedAt}
          status={status}
          updatedAt={updatedAt}
        />
      </TableCell>
      <TableCell className="whitespace-normal">
        <Link className="line-clamp-2 block hover:underline" href={href}>
          {title}
        </Link>
        {!!speakerName && (
          <p className="text-muted-foreground truncate text-sm">
            by {speakerName}
          </p>
        )}
      </TableCell>
      <TableCell className="w-px text-right">{actionsMenu}</TableCell>
    </TableRow>
  );
}
