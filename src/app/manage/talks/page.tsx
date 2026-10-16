import type { StatusType } from '@/lib/entities/types';

import { Suspense } from 'react';

import {
  ManageTable,
  ManageTableSkeleton,
} from '@/app/manage/_components/manage-table';
import { TalksFilters } from '@/app/manage/talks/_components/talks-filters';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { Skeleton } from '@/components/ui';
import { NewTalkButton } from '@/features/talks/components/new-talk-button';
import { TalksTableRow } from '@/features/talks/components/talks-table/talks-table-row';
import { getAllTalks } from '@/features/talks/queries/get-all-talks';

interface ManageTalksSearchParams {
  cursor?: string;
  search?: string;
  status?: StatusType | 'all';
}

interface ManageTalksPageProps {
  searchParams: Promise<ManageTalksSearchParams>;
}

export default function ManageTalksPage({
  searchParams,
}: ManageTalksPageProps) {
  return (
    <>
      <PageHeader
        actions={<NewTalkButton />}
        description="Manage all talks across all statuses"
        title="Manage Talks"
      />
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <TalksFilters />
      </Suspense>
      <Suspense fallback={<ManageTableSkeleton resource="talks" />}>
        <TalksContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function TalksContent({
  searchParams,
}: {
  searchParams: Promise<ManageTalksSearchParams>;
}) {
  const { cursor, search, status } = await searchParams;
  const result = await getAllTalks({
    cursor,
    limit: 50,
    search,
    status: status || 'all',
  });

  return (
    <div className="space-y-6">
      <ManageTable
        emptyAction={<NewTalkButton />}
        isEmpty={result.talks.length === 0}
        isFiltered={
          Boolean(search?.trim()) || (Boolean(status) && status !== 'all')
        }
        resource="talks"
      >
        {result.talks.map((talk) => (
          <TalksTableRow key={talk._id} talk={talk} />
        ))}
      </ManageTable>
      <Pagination
        continueCursor={result.continueCursor}
        hasNextPage={!result.isDone}
        hasPrevPage={!!cursor}
        itemCount={result.talks.length}
      />
    </div>
  );
}
