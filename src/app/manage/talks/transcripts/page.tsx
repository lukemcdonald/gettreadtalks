import { Suspense } from 'react';

import { TranscriptQueue } from '@/app/manage/talks/transcripts/_components/transcript-queue';
import { ManagePageHeader } from '@/components/manage-page-header';
import { ManageTableSkeleton } from '@/components/manage-table';

export default function ManageTranscriptsPage() {
  return (
    <>
      <ManagePageHeader title="Transcripts" />
      <Suspense fallback={<ManageTableSkeleton resource="transcripts" />}>
        <TranscriptQueue />
      </Suspense>
    </>
  );
}
