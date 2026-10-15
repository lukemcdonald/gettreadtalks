import type { StatusType } from '@/lib/entities/types';

import { Suspense } from 'react';

import { ManageClipsContent } from '@/app/manage/clips/_components/clips-content';
import { ClipsFilters } from '@/app/manage/clips/_components/clips-filters';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui';
import { NewClipButton } from '@/features/clips/components/new-clip-button';

export interface ManageClipsSearchParams {
  cursor?: string;
  status?: StatusType | 'all';
}

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
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ManageClipsContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
