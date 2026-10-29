import type { ManageListSearchParams } from '@/components/manage-table';

import { Suspense } from 'react';

import { ManageCollectionsContent } from '@/app/manage/collections/_components/collections-content';
import {
  ManageListToolbar,
  ManageSearchInput,
  ManageTableSkeleton,
} from '@/components/manage-table';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui';
import { NewCollectionButton } from '@/features/collections/components/new-collection-button';

interface ManageCollectionsPageProps {
  searchParams: Promise<ManageListSearchParams>;
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
      <Suspense fallback={<Skeleton className="h-16 w-full" />}>
        <ManageListToolbar>
          <ManageSearchInput placeholder="Search collections..." />
        </ManageListToolbar>
      </Suspense>
      <Suspense fallback={<ManageTableSkeleton resource="collections" />}>
        <ManageCollectionsContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
