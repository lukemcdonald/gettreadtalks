import type { AccountTalksSearchParams } from '@/app/account/talks/page';

import { Pagination } from '@/components/pagination';
import { TalksTable } from '@/features/talks/components/talks-table/talks-table';
import { getAllTalks } from '@/features/talks/queries/get-all-talks';

interface AccountTalksContentProps {
  searchParams: Promise<AccountTalksSearchParams>;
}

export async function AccountTalksContent({
  searchParams,
}: AccountTalksContentProps) {
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
