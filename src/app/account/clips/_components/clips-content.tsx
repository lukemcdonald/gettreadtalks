import type { AccountClipsSearchParams } from '@/app/account/clips/page';

import { Suspense } from 'react';

import { ClipsFilters } from '@/app/account/clips/_components/clips-filters';
import { Pagination } from '@/components/pagination';
import { Skeleton } from '@/components/ui';
import { ClipsTable } from '@/features/clips/components/clips-table/clips-table';
import { getAllClips } from '@/features/clips/queries/get-all-clips';

interface AccountClipsContentProps {
  searchParams: AccountClipsSearchParams;
}

export async function AccountClipsContent({
  searchParams,
}: AccountClipsContentProps) {
  const { cursor, status } = searchParams;

  const result = await getAllClips({
    cursor,
    limit: 50,
    status: status || 'all',
  });

  return (
    <div className="space-y-6">
      <ClipsFilters />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ClipsTable clips={result.clips} />
        <Pagination
          continueCursor={result.continueCursor}
          hasNextPage={!result.isDone}
          hasPrevPage={!!cursor}
          itemCount={result.clips.length}
        />
      </Suspense>
    </div>
  );
}
