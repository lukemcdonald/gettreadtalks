import type { AdminTalksSearchParams } from '@/app/account/talks/page';

import { Suspense } from 'react';

import { AdminTalksFilters } from '@/app/account/talks/_components/admin-talks-filters';
import { AdminTalksTable } from '@/app/account/talks/_components/admin-talks-table';
import { Pagination } from '@/app/talks/_components/pagination';
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
      <AdminTalksFilters />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <AdminTalksTable talks={result.talks} />
        <Pagination
          continueCursor={result.continueCursor}
          hasNextPage={!result.isDone}
          hasPrevPage={!!cursor}
        />
      </Suspense>
    </div>
  );
}
