import { CollectionsTable } from '@/features/collections/components/collections-table/collections-table';
import { getAllCollections } from '@/features/collections/queries/get-all-collections';

export async function ManageCollectionsContent() {
  const { collections } = await getAllCollections();

  return <CollectionsTable collections={collections} />;
}
