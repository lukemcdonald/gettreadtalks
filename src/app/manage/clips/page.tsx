import type { StatusType } from '@/lib/entities/types';

import { Suspense } from 'react';

import {
  ManageTable,
  ManageTableSkeleton,
} from '@/app/manage/_components/manage-table';
import { ClipsFilters } from '@/app/manage/clips/_components/clips-filters';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { Skeleton } from '@/components/ui';
import { ClipsTableRow } from '@/features/clips/components/clips-table/clips-table-row';
import { NewClipButton } from '@/features/clips/components/new-clip-button';
import { getAllClips } from '@/features/clips/queries/get-all-clips';

interface ManageClipsSearchParams {
  cursor?: string;
  status?: StatusType | 'all';
}

interface ManageClipsPageProps {
  searchParams: Promise<ManageClipsSearchParams>;
}

export default function ManageClipsPage({
  searchParams,
}: ManageClipsPageProps) {
  return (
    <>
      <PageHeader
        actions={<NewClipButton />}
        description="Manage all clips across all statuses"
        title="Manage Clips"
      />
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <ClipsFilters />
      </Suspense>
      <Suspense fallback={<ManageTableSkeleton resource="clips" />}>
        <ClipsContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function ClipsContent({
  searchParams,
}: {
  searchParams: Promise<ManageClipsSearchParams>;
}) {
  const { cursor, status } = await searchParams;
  const result = await getAllClips({
    cursor,
    limit: 50,
    status: status || 'all',
  });

  return (
    <div className="space-y-6">
      <ManageTable
        emptyAction={<NewClipButton />}
        isEmpty={result.clips.length === 0}
        isFiltered={Boolean(status) && status !== 'all'}
        resource="clips"
      >
        {result.clips.map((clip) => (
          <ClipsTableRow clip={clip} key={clip._id} />
        ))}
      </ManageTable>
      <Pagination
        continueCursor={result.continueCursor}
        hasNextPage={!result.isDone}
        hasPrevPage={!!cursor}
        itemCount={result.clips.length}
      />
    </div>
  );
}
