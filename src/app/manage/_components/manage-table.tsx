import type { ReactNode } from 'react';

import {
  Empty,
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

const COLUMNS = {
  clips: ['Status', 'Title', 'Actions'],
  collections: ['Title', 'Talks', 'Actions'],
  speakers: ['Name', 'Talks', 'Clips', 'Actions'],
  talks: ['Status', 'Title', 'Actions'],
  topics: ['Title', 'Talks', 'Actions'],
} as const;

type ManageResource = keyof typeof COLUMNS;

export function ManageTable({
  children,
  emptyAction,
  isEmpty,
  isFiltered = false,
  resource,
}: {
  children?: ReactNode;
  emptyAction?: ReactNode;
  isEmpty: boolean;
  isFiltered?: boolean;
  resource: ManageResource;
}) {
  if (isEmpty) {
    return (
      <Empty>
        <EmptyTitle>
          {`No ${resource} ${isFiltered ? 'found' : 'yet'}`}
        </EmptyTitle>
        {isFiltered ? (
          <EmptyDescription>Try a different search or filter.</EmptyDescription>
        ) : (
          emptyAction
        )}
      </Empty>
    );
  }

  return (
    <Table variant="card">
      <Header resource={resource} />
      <TableBody>{children}</TableBody>
    </Table>
  );
}

export function ManageTableSkeleton({
  resource,
}: {
  resource: ManageResource;
}) {
  return (
    <Table variant="card">
      <Header resource={resource} />
      <TableBody>
        {Array.from({ length: 6 }, (_, row) => (
          <TableRow key={row}>
            {COLUMNS[resource].map((column) => (
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

function Header({ resource }: { resource: ManageResource }) {
  return (
    <TableHeader>
      <TableRow>
        {COLUMNS[resource].map((column) => (
          <TableHead key={column}>{column}</TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
