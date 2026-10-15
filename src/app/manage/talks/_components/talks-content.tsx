import type { ManageTalksSearchParams } from '@/app/manage/talks/page';

import { Pagination } from '@/components/pagination';
import { TalksTable } from '@/features/talks/components/talks-table/talks-table';
import { getAllTalks } from '@/features/talks/queries/get-all-talks';

interface ManageTalksContentProps {
  searchParams: Promise<ManageTalksSearchParams>;
}

export async function ManageTalksContent({
  searchParams,
}: ManageTalksContentProps) {
  const { cursor, search, status } = await searchParams;

  const result = await getAllTalks({
    cursor,
    limit: 50,
    search,
    status: status || 'all',
  });

  return (
    <div className="space-y-6">
      <TalksTable talks={result.talks} />
      <Pagination
        continueCursor={result.continueCursor}
        hasNextPage={!result.isDone}
        hasPrevPage={!!cursor}
        itemCount={result.talks.length}
      />
    </div>
  );
}
