import type { ManageListSearchParams } from '@/components/manage-table';

import { ManageTable } from '@/components/manage-table';
import { CollectionsTableRow } from '@/features/collections/components/collections-table/collections-table-row';
import { NewCollectionButton } from '@/features/collections/components/new-collection-button';
import { loadAllCollections } from '@/features/collections/queries/load-all-collections';

interface ManageCollectionsContentProps {
  searchParams: Promise<ManageListSearchParams>;
}

export async function ManageCollectionsContent({
  searchParams,
}: ManageCollectionsContentProps) {
  const { cursor, search } = await searchParams;
  const result = await loadAllCollections({
    cursor,
    limit: 50,
    search,
  });

  return (
    <ManageTable
      continueCursor={result.continueCursor}
      cursor={cursor}
      emptyAction={<NewCollectionButton />}
      isDone={result.isDone}
      isEmpty={result.collections.length === 0}
      isFiltered={Boolean(search?.trim())}
      itemCount={result.collections.length}
      resource="collections"
    >
      {result.collections.map(({ collection, status, talkCount }) => (
        <CollectionsTableRow
          collection={collection}
          key={collection._id}
          status={status}
          talkCount={talkCount}
        />
      ))}
    </ManageTable>
  );
}
