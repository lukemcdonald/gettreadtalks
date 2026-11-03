import type { ManageListSearchParams } from '@/components/manage-table';

import { ManageTable } from '@/components/manage-table';
import { SpeakersTableRow } from '@/features/speakers/components/speakers-table/speakers-table-row';
import { loadSpeakersAdmin } from '@/features/speakers/queries/load-speakers-admin';
import {
  hasManageListFilters,
  parsePresenceStatus,
} from '@/lib/entities/manage-status';

interface ManageSpeakersContentProps {
  searchParams: Promise<ManageListSearchParams>;
}

export async function ManageSpeakersContent({
  searchParams,
}: ManageSpeakersContentProps) {
  const { cursor, search, status: statusParam } = await searchParams;
  const status = parsePresenceStatus(statusParam);
  const result = await loadSpeakersAdmin({
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
      isEmpty={result.speakers.length === 0}
      isFiltered={hasManageListFilters({ search, status })}
      itemCount={result.speakers.length}
      resource="speakers"
    >
      {result.speakers.map(
        ({ clipCount, speaker, status: rowStatus, talkCount }) => (
          <SpeakersTableRow
            clipCount={clipCount}
            key={speaker._id}
            speaker={speaker}
            status={rowStatus}
            talkCount={talkCount}
          />
        )
      )}
    </ManageTable>
  );
}
