import { CollectionsContent } from '@/app/collections/_components/collections-content';
import { PageHeader } from '@/components/page-header';
import { NewCollectionButton } from '@/features/collections/components/new-collection-button';
import { getAllCollections } from '@/features/collections/queries/get-all-collections';

export default async function AdminCollectionsPage() {
  const { collections } = await getAllCollections();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader description="Manage all collections" title="Manage Collections" />
        <NewCollectionButton />
      </div>
      <CollectionsContent collections={collections} hasActiveFilters={false} />
    </div>
  );
}
