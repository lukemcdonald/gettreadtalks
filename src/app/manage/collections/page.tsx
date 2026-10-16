import { Suspense } from 'react';

import { ManageTableSkeleton } from '@/app/manage/_components/manage-table';
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
      <Suspense fallback={<ManageTableSkeleton resource="collections" />}>
        <ManageCollectionsContent />
      </Suspense>
    </>
  );
}
