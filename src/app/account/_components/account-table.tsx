import type { ReactNode } from 'react';

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui';

interface AccountTableProps {
  children: ReactNode;
  label: string;
}

export function AccountTable({ children, label }: AccountTableProps) {
  return (
    <div className="p-6">
      <Table variant="card">
        <TableHeader className="sr-only">
          <TableRow>
            <TableHead>{label}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}
