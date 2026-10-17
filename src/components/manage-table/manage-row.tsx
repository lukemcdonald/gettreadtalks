import type { ManageStatus } from './manage-status';
import type { StatusType } from '@/lib/entities/types';
import type { ReactNode } from 'react';

import { TableCell, TableRow } from '@/components/ui';

import { ManageHoverDetails } from './manage-hover-details';
import { ManageStatusBadge, ManageStatusDot } from './manage-status-badge';
import { ManageTitleLink } from './manage-title-link';

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
  hoverItems,
  leading,
  status,
  subtitle,
  title,
}: {
  actions: ReactNode;
  children?: ReactNode;
  editHref: string;
  hoverItems?: readonly { label: string; value: string }[];
  leading?: ReactNode;
  status?: ManageStatus | StatusType;
  subtitle?: string;
  title: string;
}) {
  const hover =
    hoverItems && hoverItems.length > 0 ? (
      <ManageHoverDetails items={hoverItems} />
    ) : undefined;

  return (
    <TableRow className="relative min-h-11">
      <TableCell className="whitespace-normal">
        <div className="flex items-center gap-2">
          {leading}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <ManageTitleLink hover={hover} href={editHref} title={title} />
              {!!status && (
                <ManageStatusDot
                  className="relative z-10 md:hidden"
                  status={status}
                />
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
      <TableCell className="relative z-10 w-px">{actions}</TableCell>
    </TableRow>
  );
}
