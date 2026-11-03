import type { ManageListSearchParams } from '@/components/manage-table';

import { Suspense } from 'react';

import { ManageSpeakersContent } from '@/app/manage/speakers/_components/speakers-content';
import { ManageNewButton } from '@/components/manage-new-button';
import { ManagePageHeader } from '@/components/manage-page-header';
import { ManageFilters, ManageTableSkeleton } from '@/components/manage-table';
import { Skeleton } from '@/components/ui';
import { PRESENCE_STATUS_OPTIONS } from '@/lib/entities/manage-status';

interface ManageSpeakersPageProps {
  searchParams: Promise<ManageListSearchParams>;
}

export default function ManageSpeakersPage({
  searchParams,
}: ManageSpeakersPageProps) {
  return (
    <>
      <ManagePageHeader
        action={<ManageNewButton entity="speakers" />}
        title="Speakers"
      />
      <Suspense fallback={<Skeleton className="h-16 w-full" />}>
        <ManageFilters
          searchPlaceholder="Search speakers..."
          statusOptions={PRESENCE_STATUS_OPTIONS}
        />
      </Suspense>
      <Suspense fallback={<ManageTableSkeleton resource="speakers" />}>
        <ManageSpeakersContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
