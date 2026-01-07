import type { AdminTalksSearchParams } from '@/app/admin/talks/page';

import { Suspense } from 'react';

import { AdminTalksFilters } from '@/app/admin/talks/_components/admin-talks-filters';
import { AdminTalksTable } from '@/app/admin/talks/_components/admin-talks-table';
import { Pagination } from '@/app/talks/_components/pagination';
import { Skeleton } from '@/components/ui';
import { getTalksWithSpeakers } from '@/features/talks';

type AdminTalksContentProps = {
  searchParams: AdminTalksSearchParams;
};

export async function AdminTalksContent({ searchParams }: AdminTalksContentProps) {
  const { cursor, search, status } = searchParams;

  const result = await getTalksWithSpeakers({
    cursor,
    limit: 50,
    search,
    status,
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
