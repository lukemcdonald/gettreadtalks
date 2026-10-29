import { ManageTable } from '@/components/manage-table';
import { Pagination } from '@/components/pagination';
import { CollectionsTableRow } from '@/features/collections/components/collections-table/collections-table-row';
import { NewCollectionButton } from '@/features/collections/components/new-collection-button';
import { loadAllCollections } from '@/features/collections/queries/load-all-collections';

export interface ManageCollectionsSearchParams {
  cursor?: string;
  search?: string;
}

interface ManageCollectionsContentProps {
  searchParams: Promise<ManageCollectionsSearchParams>;
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
    <div className="space-y-6">
      <ManageTable
        emptyAction={<NewCollectionButton />}
        isEmpty={result.collections.length === 0}
        isFiltered={Boolean(search?.trim())}
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
      <Pagination
        continueCursor={result.continueCursor}
        hasNextPage={!result.isDone}
        hasPrevPage={!!cursor}
        itemCount={result.collections.length}
      />
    </div>
  );
}
