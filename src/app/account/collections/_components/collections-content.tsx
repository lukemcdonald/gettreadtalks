import { CollectionsTable } from '@/features/collections/components/collections-table/collections-table';
import { getAllCollections } from '@/features/collections/queries/get-all-collections';

export async function AccountCollectionsContent() {
  const { collections } = await getAllCollections();

  return <CollectionsTable collections={collections} />;
}
