import type { ManageClipsSearchParams } from '@/app/manage/clips/_components/clips-content';

import { Suspense } from 'react';

import { ManageTableSkeleton } from '@/app/manage/_components/manage-table';
import { ManageClipsContent } from '@/app/manage/clips/_components/clips-content';
import { ClipsFilters } from '@/app/manage/clips/_components/clips-filters';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui';
import { NewClipButton } from '@/features/clips/components/new-clip-button';

interface ManageClipsPageProps {
  searchParams: Promise<ManageClipsSearchParams>;
}

export default function ManageClipsPage({
  searchParams,
}: ManageClipsPageProps) {
  return (
    <>
      <PageHeader
        actions={<NewClipButton />}
        description="Manage all clips across all statuses"
        title="Manage Clips"
      />
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <ClipsFilters />
      </Suspense>
      <Suspense fallback={<ManageTableSkeleton resource="clips" />}>
        <ManageClipsContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
