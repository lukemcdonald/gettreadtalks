import type { ReactNode } from 'react';

import { Pagination } from '@/components/pagination';
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

const HIDDEN_MD = 'hidden md:table-cell';

interface ManageColumn {
  className?: string;
  key: string;
  srOnly?: boolean;
}

const COLUMNS: Record<string, readonly ManageColumn[]> = {
  clips: [
    { key: 'Title' },
    { className: HIDDEN_MD, key: 'Status' },
    { className: 'w-px', key: 'Actions', srOnly: true },
  ],
  collections: [
    { key: 'Title' },
    { className: `${HIDDEN_MD} text-right`, key: 'Talks' },
    { className: HIDDEN_MD, key: 'Status' },
    { className: 'w-px', key: 'Actions', srOnly: true },
  ],
  speakers: [
    { key: 'Name' },
    { className: `${HIDDEN_MD} text-right`, key: 'Talks' },
    { className: HIDDEN_MD, key: 'Status' },
    { className: 'w-px', key: 'Actions', srOnly: true },
  ],
  talks: [
    { key: 'Title' },
    { className: HIDDEN_MD, key: 'Status' },
    { className: 'w-px', key: 'Actions', srOnly: true },
  ],
  topics: [
    { key: 'Name' },
    { className: `${HIDDEN_MD} text-right`, key: 'Talks' },
    { className: 'w-px', key: 'Actions', srOnly: true },
  ],
  transcripts: [{ key: 'Title' }, { className: 'max-w-md', key: 'Last error' }],
};

type ManageResource =
  | 'clips'
  | 'collections'
  | 'speakers'
  | 'talks'
  | 'topics'
  | 'transcripts';

export function ManageTable({
  children,
  continueCursor,
  cursor,
  emptyAction,
  isDone,
  isEmpty,
  isFiltered = false,
  itemCount,
  resource,
}: {
  children?: ReactNode;
  continueCursor?: string | null;
  cursor?: string;
  emptyAction?: ReactNode;
  isDone?: boolean;
  isEmpty: boolean;
  isFiltered?: boolean;
  itemCount?: number;
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
    <div className="space-y-6">
      <Table variant="card">
        <Header resource={resource} />
        <TableBody>{children}</TableBody>
      </Table>
      {continueCursor === undefined ||
      isDone === undefined ||
      itemCount === undefined ? null : (
        <Pagination
          continueCursor={continueCursor}
          hasNextPage={!isDone}
          hasPrevPage={Boolean(cursor)}
          itemCount={itemCount}
        />
      )}
    </div>
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
