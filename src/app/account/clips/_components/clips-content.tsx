import type { AccountClipsSearchParams } from '@/app/account/clips/page';

import { Pagination } from '@/components/pagination';
import { ClipsTable } from '@/features/clips/components/clips-table/clips-table';
import { getAllClips } from '@/features/clips/queries/get-all-clips';

interface AccountClipsContentProps {
  searchParams: Promise<AccountClipsSearchParams>;
}

export async function AccountClipsContent({
  searchParams,
}: AccountClipsContentProps) {
  const { cursor, status } = await searchParams;

  const result = await getAllClips({
    cursor,
    limit: 50,
    status: status || 'all',
  });

  return (
    <div className="space-y-6">
      <ClipsTable clips={result.clips} />
      <Pagination
        continueCursor={result.continueCursor}
        hasNextPage={!result.isDone}
        hasPrevPage={!!cursor}
        itemCount={result.clips.length}
      />
    </div>
  );
}
