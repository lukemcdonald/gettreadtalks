import { Suspense } from 'react';

import { TranscriptQueue } from '@/app/manage/talks/transcripts/_components/transcript-queue';
import { ManageTableSkeleton } from '@/components/manage-table';
import { PageHeader } from '@/components/page-header';

export default function ManageTranscriptsPage() {
  return (
    <>
      <PageHeader
        description="Published talks that do not have a transcript yet"
        title="Transcript queue"
      />
      <Suspense fallback={<ManageTableSkeleton resource="transcripts" />}>
        <TranscriptQueue />
      </Suspense>
    </>
  );
}
