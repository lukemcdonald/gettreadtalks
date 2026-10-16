import type { AdminEntity } from '@/lib/entities/paths';
import type { StatusType } from '@/lib/entities/types';
import type { ReactNode } from 'react';

import { ManageEditButton } from '@/components/manage-edit-button';
import { StatusPopover } from '@/components/status-popover';
import { TableCell, TableRow } from '@/components/ui';
import { Link } from '@/components/ui/link';

interface ContentTableRowProps {
  actionsMenu: ReactNode;
  createdAt: number;
  entity: Extract<AdminEntity, 'clips' | 'talks'>;
  href: string;
  id: string;
  publishedAt?: number;
  speakerName?: string;
  status?: StatusType;
  title: string;
  updatedAt?: number;
}

export function ContentTableRow({
  actionsMenu,
  createdAt,
  entity,
  href,
  id,
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
      <TableCell className="w-px text-right">
        <div className="flex items-center justify-end gap-1">
          <ManageEditButton entity={entity} id={id} name={title} />
          {actionsMenu}
        </div>
      </TableCell>
    </TableRow>
  );
}
