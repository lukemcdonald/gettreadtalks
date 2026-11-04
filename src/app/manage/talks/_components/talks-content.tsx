import type { StatusType } from '@/lib/entities/types';

import { ManageTable } from '@/components/manage-table';
import { TalksTableRow } from '@/features/talks/components/talks-table/talks-table-row';
import { loadAllTalks } from '@/features/talks/queries/load-all-talks';
import {
  hasManageListFilters,
  parseContentStatus,
} from '@/lib/entities/manage-status';

export interface ManageTalksSearchParams {
  cursor?: string;
  search?: string;
  status?: StatusType | 'all';
  study?: 'draft' | 'none' | 'published';
}

interface ManageTalksContentProps {
  searchParams: Promise<ManageTalksSearchParams>;
}

function hasTalksFilters({
  search,
  status,
  study,
}: {
  search?: string;
  status: string;
  study?: string;
}) {
  if (hasManageListFilters({ search, status })) {
    return true;
  }

  return Boolean(study);
}

export async function ManageTalksContent({
  searchParams,
}: ManageTalksContentProps) {
  const { cursor, search, status: statusParam, study } = await searchParams;
  const status = parseContentStatus(statusParam);
  const result = await loadAllTalks({
    cursor,
    limit: 50,
    search,
    status,
    studyStatus: study,
  });

  return (
    <ManageTable
      continueCursor={result.continueCursor}
      cursor={cursor}
      isDone={result.isDone}
      isEmpty={result.talks.length === 0}
      isFiltered={hasTalksFilters({ search, status, study })}
      itemCount={result.talks.length}
      resource="talks"
    >
      {result.talks.map((talk) => (
        <TalksTableRow key={talk._id} talk={talk} />
      ))}
    </ManageTable>
  );
}
