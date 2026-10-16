import type { ReactNode } from 'react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyTitle,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';

const MANAGE_COLUMNS = {
  clips: ['Status', 'Title', 'Actions'],
  collections: ['Title', 'Talks', 'Actions'],
  speakers: ['Name', 'Talks', 'Clips', 'Actions'],
  talks: ['Status', 'Title', 'Actions'],
  topics: ['Title', 'Talks', 'Actions'],
} as const;

export type ManageResource = keyof typeof MANAGE_COLUMNS;

interface ManageTableProps {
  children?: ReactNode;
  emptyAction?: ReactNode;
  isEmpty: boolean;
  isFiltered?: boolean;
  resource: ManageResource;
}

export function ManageTable({
  children,
  emptyAction,
  isEmpty,
  isFiltered = false,
  resource,
}: ManageTableProps) {
  if (isEmpty) {
    if (isFiltered) {
      return (
        <Empty>
          <EmptyTitle>No {resource} found</EmptyTitle>
          <EmptyDescription>Try a different search or filter.</EmptyDescription>
        </Empty>
      );
    }

    return (
      <Empty>
        <EmptyTitle>No {resource} yet</EmptyTitle>
        {!!emptyAction && <EmptyContent>{emptyAction}</EmptyContent>}
      </Empty>
    );
  }

  return (
    <Table variant="card">
      <ManageTableHeader resource={resource} />
      <TableBody>{children}</TableBody>
    </Table>
  );
}

export function ManageTableSkeleton({
  resource,
}: {
  resource: ManageResource;
}) {
  const columns = MANAGE_COLUMNS[resource];

  return (
    <Table variant="card">
      <ManageTableHeader resource={resource} />
      <TableBody>
        {Array.from({ length: 6 }, (_, row) => (
          <TableRow key={row}>
            {columns.map((column) => (
              <TableCell key={column}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ManageTableHeader({ resource }: { resource: ManageResource }) {
  return (
    <TableHeader>
      <TableRow>
        {MANAGE_COLUMNS[resource].map((column) => (
          <TableHead key={column}>{column}</TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
