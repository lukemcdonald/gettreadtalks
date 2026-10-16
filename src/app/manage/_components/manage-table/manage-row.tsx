import type { ManageStatus } from './manage-status';
import type { StatusType } from '@/lib/entities/types';
import type { ReactNode } from 'react';

import { TableCell, TableRow } from '@/components/ui';
import { Link } from '@/components/ui/link';
import { formatRelativeUpdated } from '@/utils';

import { ManageStatusBadge, ManageStatusDot } from './manage-status-badge';

export function ManageCountCell({ children }: { children: ReactNode }) {
  return (
    <TableCell className="hidden text-right tabular-nums md:table-cell">
      {children}
    </TableCell>
  );
}

export function ManageRow({
  actions,
  children,
  editHref,
  leading,
  status,
  subtitle,
  title,
  updatedAt,
}: {
  actions: ReactNode;
  children?: ReactNode;
  editHref: string;
  leading?: ReactNode;
  status?: ManageStatus | StatusType;
  subtitle?: string;
  title: string;
  updatedAt: number;
}) {
  return (
    <TableRow className="relative h-11">
      <TableCell className="whitespace-normal">
        <div className="flex items-center gap-2">
          {leading}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link
                className="block truncate font-medium after:absolute after:inset-0"
                href={editHref}
              >
                {title}
              </Link>
              {!!status && (
                <ManageStatusDot className="md:hidden" status={status} />
              )}
            </div>
            {!!subtitle && (
              <p className="text-muted-foreground truncate text-sm">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </TableCell>
      {children}
      {!!status && (
        <TableCell className="hidden md:table-cell">
          <ManageStatusBadge status={status} />
        </TableCell>
      )}
      <TableCell className="text-muted-foreground hidden tabular-nums md:table-cell">
        {formatRelativeUpdated(updatedAt)}
      </TableCell>
      <TableCell className="relative z-10 w-px">{actions}</TableCell>
    </TableRow>
  );
}
