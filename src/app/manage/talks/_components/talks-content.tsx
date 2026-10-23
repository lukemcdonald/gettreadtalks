import type { StatusType } from '@/lib/entities/types';

import { ManageTable } from '@/components/manage-table';
import { Pagination } from '@/components/pagination';
import { NewTalkButton } from '@/features/talks/components/new-talk-button';
import { TalksTableRow } from '@/features/talks/components/talks-table/talks-table-row';
import { loadAllTalks } from '@/features/talks/queries/load-all-talks';

export interface ManageTalksSearchParams {
  cursor?: string;
  search?: string;
  status?: StatusType | 'all';
  study?: 'draft' | 'none' | 'published';
}

interface ManageTalksContentProps {
  searchParams: Promise<ManageTalksSearchParams>;
}

function hasTalksFilters({ search, status, study }: ManageTalksSearchParams) {
  if (search?.trim()) {
    return true;
  }

  if (status && status !== 'all') {
    return true;
  }

  return Boolean(study);
}

export async function ManageTalksContent({
  searchParams,
}: ManageTalksContentProps) {
  const { cursor, search, status, study } = await searchParams;
  const result = await loadAllTalks({
    cursor,
    limit: 50,
    search,
    status: status || 'all',
    studyStatus: study,
  });

  return (
    <div className="space-y-6">
      <ManageTable
        emptyAction={<NewTalkButton />}
        isEmpty={result.talks.length === 0}
        isFiltered={hasTalksFilters({ search, status, study })}
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
