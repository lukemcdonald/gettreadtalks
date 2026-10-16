import { Suspense } from 'react';

import { ManageTableSkeleton } from '@/app/manage/_components/manage-table';
import { ManageSpeakersContent } from '@/app/manage/speakers/_components/speakers-content';
import { PageHeader } from '@/components/page-header';
import { NewSpeakerButton } from '@/features/speakers/components/new-speaker-button';

export default function ManageSpeakersPage() {
  return (
    <>
      <PageHeader
        actions={<NewSpeakerButton />}
        description="Manage all speakers"
        title="Manage Speakers"
      />
      <Suspense fallback={<ManageTableSkeleton resource="speakers" />}>
        <ManageSpeakersContent />
      </Suspense>
    </>
  );
}
