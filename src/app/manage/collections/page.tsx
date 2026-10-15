import { ManageCollectionsContent } from '@/app/manage/collections/_components/collections-content';
import { PageHeader } from '@/components/page-header';
import { NewCollectionButton } from '@/features/collections/components/new-collection-button';

export default function ManageCollectionsPage() {
  return (
    <>
      <PageHeader
        actions={<NewCollectionButton />}
        description="Manage all collections"
        title="Manage Collections"
      />
      <ManageCollectionsContent />
    </>
  );
}
