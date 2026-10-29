import type { StatusType } from '@/lib/entities/types';

import { ManageTable } from '@/components/manage-table';
import { Pagination } from '@/components/pagination';
import { ClipsTableRow } from '@/features/clips/components/clips-table/clips-table-row';
import { NewClipButton } from '@/features/clips/components/new-clip-button';
import { loadAllClips } from '@/features/clips/queries/load-all-clips';

export interface ManageClipsSearchParams {
  cursor?: string;
  search?: string;
  status?: StatusType | 'all';
}

interface ManageClipsContentProps {
  searchParams: Promise<ManageClipsSearchParams>;
}

function hasClipsFilters({ search, status }: ManageClipsSearchParams) {
  if (search?.trim()) {
    return true;
  }

  return Boolean(status) && status !== 'all';
}

export async function ManageClipsContent({
  searchParams,
}: ManageClipsContentProps) {
  const { cursor, search, status } = await searchParams;
  const result = await loadAllClips({
    cursor,
    limit: 50,
    search,
    status: status || 'all',
  });

  return (
    <div className="space-y-6">
      <ManageTable
        emptyAction={<NewClipButton />}
        isEmpty={result.clips.length === 0}
        isFiltered={hasClipsFilters({ search, status })}
        resource="clips"
      >
        {result.clips.map((clip) => (
          <ClipsTableRow clip={clip} key={clip._id} />
        ))}
      </ManageTable>
      <Pagination
        continueCursor={result.continueCursor}
        hasNextPage={!result.isDone}
        hasPrevPage={!!cursor}
        itemCount={result.clips.length}
      />
    </div>
  );
}
