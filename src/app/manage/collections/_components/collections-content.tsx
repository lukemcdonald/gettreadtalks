import { ManageTable } from '@/app/manage/_components/manage-table';
import { CollectionsTableRow } from '@/features/collections/components/collections-table/collections-table-row';
import { NewCollectionButton } from '@/features/collections/components/new-collection-button';
import { loadAllCollections } from '@/features/collections/queries/load-all-collections';

export async function ManageCollectionsContent() {
  const { collections } = await loadAllCollections();

  return (
    <ManageTable
      emptyAction={<NewCollectionButton />}
      isEmpty={collections.length === 0}
      resource="collections"
    >
      {collections.map(({ collection, status, talkCount }) => (
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
