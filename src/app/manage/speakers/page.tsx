import type { ManageListSearchParams } from '@/components/manage-table';

import { Suspense } from 'react';

import { ManageSpeakersContent } from '@/app/manage/speakers/_components/speakers-content';
import {
  ManageListToolbar,
  ManageSearchInput,
  ManageTableSkeleton,
} from '@/components/manage-table';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui';
import { NewSpeakerButton } from '@/features/speakers/components/new-speaker-button';

interface ManageSpeakersPageProps {
  searchParams: Promise<ManageListSearchParams>;
}

export default function ManageSpeakersPage({
  searchParams,
}: ManageSpeakersPageProps) {
  return (
    <>
      <PageHeader
        actions={<NewSpeakerButton />}
        description="Manage all speakers"
        title="Manage Speakers"
      />
      <Suspense fallback={<Skeleton className="h-16 w-full" />}>
        <ManageListToolbar>
          <ManageSearchInput placeholder="Search speakers..." />
        </ManageListToolbar>
      </Suspense>
      <Suspense fallback={<ManageTableSkeleton resource="speakers" />}>
        <ManageSpeakersContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
