import { Suspense } from 'react';

import {
  ManageTable,
  ManageTableSkeleton,
} from '@/app/manage/_components/manage-table';
import { PageHeader } from '@/components/page-header';
import { CollectionsTableRow } from '@/features/collections/components/collections-table/collections-table-row';
import { NewCollectionButton } from '@/features/collections/components/new-collection-button';
import { getAllCollections } from '@/features/collections/queries/get-all-collections';

export default function ManageCollectionsPage() {
  return (
    <>
      <PageHeader
        actions={<NewCollectionButton />}
        description="Manage all collections"
        title="Manage Collections"
      />
      <Suspense fallback={<ManageTableSkeleton resource="collections" />}>
        <CollectionsContent />
      </Suspense>
    </>
  );
}

async function CollectionsContent() {
  const { collections } = await getAllCollections();

  return (
    <ManageTable
      emptyAction={<NewCollectionButton />}
      isEmpty={collections.length === 0}
      resource="collections"
    >
      {collections.map(({ collection, talkCount }) => (
        <CollectionsTableRow
          collection={collection}
          key={collection._id}
          talkCount={talkCount}
        />
      ))}
    </ManageTable>
  );
}
