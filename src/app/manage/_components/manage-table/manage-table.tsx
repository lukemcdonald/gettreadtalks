import type { ReactNode } from 'react';

import {
  CardFrame,
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

const HIDDEN_MD = 'hidden md:table-cell';

interface ManageColumn {
  className?: string;
  key: string;
  srOnly?: boolean;
}

const COLUMNS = {
  clips: [
    { key: 'Title' },
    { className: HIDDEN_MD, key: 'Status' },
    { className: HIDDEN_MD, key: 'Updated' },
    { className: 'w-px', key: 'Actions', srOnly: true },
  ],
  collections: [
    { key: 'Title' },
    { className: `${HIDDEN_MD} text-right`, key: 'Talks' },
    { className: HIDDEN_MD, key: 'Status' },
    { className: HIDDEN_MD, key: 'Updated' },
    { className: 'w-px', key: 'Actions', srOnly: true },
  ],
  speakers: [
    { key: 'Name' },
    { className: `${HIDDEN_MD} text-right`, key: 'Talks' },
    { className: HIDDEN_MD, key: 'Status' },
    { className: HIDDEN_MD, key: 'Updated' },
    { className: 'w-px', key: 'Actions', srOnly: true },
  ],
  talks: [
    { key: 'Title' },
    { className: HIDDEN_MD, key: 'Status' },
    { className: HIDDEN_MD, key: 'Updated' },
    { className: 'w-px', key: 'Actions', srOnly: true },
  ],
  topics: [
    { key: 'Name' },
    { className: `${HIDDEN_MD} text-right`, key: 'Talks' },
    { className: HIDDEN_MD, key: 'Updated' },
    { className: 'w-px', key: 'Actions', srOnly: true },
  ],
} satisfies Record<string, readonly ManageColumn[]>;

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
    <CardFrame>
      <Table variant="card">
        <Header resource={resource} />
        <TableBody>{children}</TableBody>
      </Table>
    </CardFrame>
  );
}

export function ManageTableSkeleton({
  resource,
}: {
  resource: ManageResource;
}) {
  return (
    <CardFrame>
      <Table variant="card">
        <Header resource={resource} />
        <TableBody>
          {Array.from({ length: 6 }, (_, row) => (
            <TableRow className="h-11" key={row}>
              {COLUMNS[resource].map((column) => (
                <TableCell className={column.className} key={column.key}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardFrame>
  );
}

function Header({ resource }: { resource: ManageResource }) {
  return (
    <TableHeader>
      <TableRow>
        {COLUMNS[resource].map((column) => (
          <TableHead className={column.className} key={column.key}>
            {column.srOnly ? (
              <span className="sr-only">{column.key}</span>
            ) : (
              column.key
            )}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
