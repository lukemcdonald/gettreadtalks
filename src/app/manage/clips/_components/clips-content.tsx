import type { StatusType } from '@/lib/entities/types';

import { ManageTable } from '@/components/manage-table';
import { ClipsTableRow } from '@/features/clips/components/clips-table/clips-table-row';
import { loadAllClips } from '@/features/clips/queries/load-all-clips';
import {
  hasManageListFilters,
  parseContentStatus,
} from '@/lib/entities/manage-status';

export interface ManageClipsSearchParams {
  cursor?: string;
  search?: string;
  status?: StatusType | 'all';
}

interface ManageClipsContentProps {
  searchParams: Promise<ManageClipsSearchParams>;
}

export async function ManageClipsContent({
  searchParams,
}: ManageClipsContentProps) {
  const { cursor, search, status: statusParam } = await searchParams;
  const status = parseContentStatus(statusParam);
  const result = await loadAllClips({
    cursor,
    limit: 50,
    search,
    status,
  });

  return (
    <ManageTable
      continueCursor={result.continueCursor}
      cursor={cursor}
      isDone={result.isDone}
      isEmpty={result.clips.length === 0}
      isFiltered={hasManageListFilters({ search, status })}
      itemCount={result.clips.length}
      resource="clips"
    >
      {result.clips.map((clip) => (
        <ClipsTableRow clip={clip} key={clip._id} />
      ))}
    </ManageTable>
  );
}
