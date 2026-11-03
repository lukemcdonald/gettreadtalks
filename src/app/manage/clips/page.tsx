import type { ManageClipsSearchParams } from '@/app/manage/clips/_components/clips-content';

import { Suspense } from 'react';

import { ManageClipsContent } from '@/app/manage/clips/_components/clips-content';
import { ManageNewButton } from '@/components/manage-new-button';
import { ManagePageHeader } from '@/components/manage-page-header';
import { ManageFilters, ManageTableSkeleton } from '@/components/manage-table';
import { Skeleton } from '@/components/ui';
import { CONTENT_STATUS_OPTIONS } from '@/lib/entities/manage-status';

interface ManageClipsPageProps {
  searchParams: Promise<ManageClipsSearchParams>;
}

export default function ManageClipsPage({
  searchParams,
}: ManageClipsPageProps) {
  return (
    <>
      <ManagePageHeader
        action={<ManageNewButton entity="clips" />}
        title="Clips"
      />
      <Suspense fallback={<Skeleton className="h-16 w-full" />}>
        <ManageFilters
          searchPlaceholder="Search clips..."
          statusOptions={CONTENT_STATUS_OPTIONS}
        />
      </Suspense>
      <Suspense fallback={<ManageTableSkeleton resource="clips" />}>
        <ManageClipsContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
