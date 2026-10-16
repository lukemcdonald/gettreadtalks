import { Suspense } from 'react';

import {
  ManageTable,
  ManageTableSkeleton,
} from '@/app/manage/_components/manage-table';
import { PageHeader } from '@/components/page-header';
import { NewSpeakerButton } from '@/features/speakers/components/new-speaker-button';
import { SpeakersTableRow } from '@/features/speakers/components/speakers-table/speakers-table-row';
import { getSpeakersAdmin } from '@/features/speakers/queries/get-speakers-admin';

export default function ManageSpeakersPage() {
  return (
    <>
      <PageHeader
        actions={<NewSpeakerButton />}
        description="Manage all speakers"
        title="Manage Speakers"
      />
      <Suspense fallback={<ManageTableSkeleton resource="speakers" />}>
        <SpeakersContent />
      </Suspense>
    </>
  );
}

async function SpeakersContent() {
  const { speakers } = await getSpeakersAdmin();

  return (
    <ManageTable
      emptyAction={<NewSpeakerButton />}
      isEmpty={speakers.length === 0}
      resource="speakers"
    >
      {speakers.map(({ clipCount, speaker, talkCount }) => (
        <SpeakersTableRow
          clipCount={clipCount}
          key={speaker._id}
          speaker={speaker}
          talkCount={talkCount}
        />
      ))}
    </ManageTable>
  );
}
