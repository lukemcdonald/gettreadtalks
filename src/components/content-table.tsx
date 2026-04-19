import type { ReactNode } from 'react';

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui';

interface ContentTableProps {
  children: ReactNode;
  columns: string[];
}

export function ContentTable({ children, columns }: ContentTableProps) {
  return (
    <Table variant="card">
      <TableHeader className="sr-only">
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col}>{col}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  );
}
