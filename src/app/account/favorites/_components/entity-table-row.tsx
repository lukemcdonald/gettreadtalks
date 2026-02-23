import type { ReactNode } from 'react';

import { Link, TableCell, TableRow } from '@/components/ui';

interface EntityTableRowProps {
  action: ReactNode;
  href: string;
  title: string;
}

export function EntityTableRow({ action, href, title }: EntityTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center justify-between gap-4">
          <Link className="hover:underline" href={href}>
            {title}
          </Link>
          {action}
        </div>
      </TableCell>
    </TableRow>
  );
}
