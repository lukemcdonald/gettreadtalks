import type { ManageSpeakersSearchParams } from '@/app/manage/speakers/_components/speakers-content';

import { Suspense } from 'react';

import { ManageSpeakersContent } from '@/app/manage/speakers/_components/speakers-content';
import { SpeakersFilters } from '@/app/manage/speakers/_components/speakers-filters';
import { ManageTableSkeleton } from '@/components/manage-table';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui';
import { NewSpeakerButton } from '@/features/speakers/components/new-speaker-button';

interface ManageSpeakersPageProps {
  searchParams: Promise<ManageSpeakersSearchParams>;
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
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <SpeakersFilters />
      </Suspense>
      <Suspense fallback={<ManageTableSkeleton resource="speakers" />}>
        <ManageSpeakersContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
