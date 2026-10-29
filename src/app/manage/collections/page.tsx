import type { ManageCollectionsSearchParams } from '@/app/manage/collections/_components/collections-content';

import { Suspense } from 'react';

import { ManageCollectionsContent } from '@/app/manage/collections/_components/collections-content';
import { CollectionsFilters } from '@/app/manage/collections/_components/collections-filters';
import { ManageTableSkeleton } from '@/components/manage-table';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui';
import { NewCollectionButton } from '@/features/collections/components/new-collection-button';

interface ManageCollectionsPageProps {
  searchParams: Promise<ManageCollectionsSearchParams>;
}

export default function ManageCollectionsPage({
  searchParams,
}: ManageCollectionsPageProps) {
  return (
    <>
      <PageHeader
        actions={<NewCollectionButton />}
        description="Manage all collections"
        title="Manage Collections"
      />
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <CollectionsFilters />
      </Suspense>
      <Suspense fallback={<ManageTableSkeleton resource="collections" />}>
        <ManageCollectionsContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
