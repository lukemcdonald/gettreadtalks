import type { AccountTalksSearchParams } from '@/app/account/talks/page';

import { Suspense } from 'react';

import { TalksFilters } from '@/app/account/talks/_components/talks-filters';
import { Pagination } from '@/components/pagination';
import { Skeleton } from '@/components/ui';
import { TalksTable } from '@/features/talks/components/talks-table/talks-table';
import { getAllTalks } from '@/features/talks/queries/get-all-talks';

interface AccountTalksContentProps {
  searchParams: AccountTalksSearchParams;
}

export async function AccountTalksContent({ searchParams }: AccountTalksContentProps) {
  const { cursor, search, status } = searchParams;

  const result = await getAllTalks({
    cursor,
    limit: 50,
    search,
    status: status || 'all',
  });

  return (
    <div className="space-y-6">
      <TalksFilters />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <TalksTable talks={result.talks} />
        <Pagination
          continueCursor={result.continueCursor}
          hasNextPage={!result.isDone}
          hasPrevPage={!!cursor}
          itemCount={result.talks.length}
        />
      </Suspense>
    </div>
  );
}
