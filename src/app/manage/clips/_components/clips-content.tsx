import type { StatusType } from '@/lib/entities/types';

import { ManageTable } from '@/app/manage/_components/manage-table';
import { Pagination } from '@/components/pagination';
import { ClipsTableRow } from '@/features/clips/components/clips-table/clips-table-row';
import { NewClipButton } from '@/features/clips/components/new-clip-button';
import { getAllClips } from '@/features/clips/queries/get-all-clips';

export interface ManageClipsSearchParams {
  cursor?: string;
  status?: StatusType | 'all';
}

interface ManageClipsContentProps {
  searchParams: Promise<ManageClipsSearchParams>;
}

export async function ManageClipsContent({
  searchParams,
}: ManageClipsContentProps) {
  const { cursor, status } = await searchParams;
  const result = await getAllClips({
    cursor,
    limit: 50,
    status: status || 'all',
  });

  return (
    <div className="space-y-6">
      <ManageTable
        emptyAction={<NewClipButton />}
        isEmpty={result.clips.length === 0}
        isFiltered={Boolean(status) && status !== 'all'}
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
