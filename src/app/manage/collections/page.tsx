import type { ManageListSearchParams } from '@/components/manage-table';

import { Suspense } from 'react';

import { ManageCollectionsContent } from '@/app/manage/collections/_components/collections-content';
import { ManageNewButton } from '@/components/manage-new-button';
import { ManagePageHeader } from '@/components/manage-page-header';
import { ManageFilters, ManageTableSkeleton } from '@/components/manage-table';
import { Skeleton } from '@/components/ui';
import { PRESENCE_STATUS_OPTIONS } from '@/lib/entities/manage-status';

interface ManageCollectionsPageProps {
  searchParams: Promise<ManageListSearchParams>;
}

export default function ManageCollectionsPage({
  searchParams,
}: ManageCollectionsPageProps) {
  return (
    <>
      <ManagePageHeader
        action={<ManageNewButton entity="collections" />}
        title="Collections"
      />
      <Suspense fallback={<Skeleton className="h-16 w-full" />}>
        <ManageFilters
          searchPlaceholder="Search collections..."
          statusOptions={PRESENCE_STATUS_OPTIONS}
        />
      </Suspense>
      <Suspense fallback={<ManageTableSkeleton resource="collections" />}>
        <ManageCollectionsContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
