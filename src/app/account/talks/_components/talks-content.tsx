import type { AdminTalksSearchParams } from '@/app/account/talks/page';

import { Suspense } from 'react';

import { TalksFilters } from '@/app/account/talks/_components/talks-filters';
import { TalksTable } from '@/app/account/talks/_components/talks-table';
import { Pagination } from '@/components/pagination';
import { Skeleton } from '@/components/ui';
import { getTalksWithSpeakersAdmin } from '@/features/talks';

type AdminTalksContentProps = {
  searchParams: AdminTalksSearchParams;
};

export async function AdminTalksContent({ searchParams }: AdminTalksContentProps) {
  const { cursor, search, status } = searchParams;

  const result = await getTalksWithSpeakersAdmin({
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
