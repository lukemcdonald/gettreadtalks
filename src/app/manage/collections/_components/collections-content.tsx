import type { ManageListSearchParams } from '@/components/manage-table';

import { ManageTable } from '@/components/manage-table';
import { CollectionsTableRow } from '@/features/collections/components/collections-table/collections-table-row';
import { loadAllCollections } from '@/features/collections/queries/load-all-collections';
import {
  hasManageListFilters,
  parsePresenceStatus,
} from '@/lib/entities/manage-status';

interface ManageCollectionsContentProps {
  searchParams: Promise<ManageListSearchParams>;
}

export async function ManageCollectionsContent({
  searchParams,
}: ManageCollectionsContentProps) {
  const { cursor, search, status: statusParam } = await searchParams;
  const status = parsePresenceStatus(statusParam);
  const result = await loadAllCollections({
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
      isEmpty={result.collections.length === 0}
      isFiltered={hasManageListFilters({ search, status })}
      itemCount={result.collections.length}
      resource="collections"
    >
      {result.collections.map(
        ({ collection, status: rowStatus, talkCount }) => (
          <CollectionsTableRow
            collection={collection}
            key={collection._id}
            status={rowStatus}
            talkCount={talkCount}
          />
        )
      )}
    </ManageTable>
  );
}
