import type { ManageTalksSearchParams } from '@/app/manage/talks/page';

import { ManageTable } from '@/app/manage/_components/manage-table';
import { Pagination } from '@/components/pagination';
import { NewTalkButton } from '@/features/talks/components/new-talk-button';
import { TalksTableRow } from '@/features/talks/components/talks-table/talks-table-row';
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
  const isFiltered =
    Boolean(search?.trim()) || (Boolean(status) && status !== 'all');

  return (
    <div className="space-y-6">
      <ManageTable
        emptyAction={<NewTalkButton />}
        isEmpty={result.talks.length === 0}
        isFiltered={isFiltered}
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
