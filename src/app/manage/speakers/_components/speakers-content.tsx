import type { ManageListSearchParams } from '@/components/manage-table';

import { ManageTable } from '@/components/manage-table';
import { NewSpeakerButton } from '@/features/speakers/components/new-speaker-button';
import { SpeakersTableRow } from '@/features/speakers/components/speakers-table/speakers-table-row';
import { loadSpeakersAdmin } from '@/features/speakers/queries/load-speakers-admin';

interface ManageSpeakersContentProps {
  searchParams: Promise<ManageListSearchParams>;
}

export async function ManageSpeakersContent({
  searchParams,
}: ManageSpeakersContentProps) {
  const { cursor, search } = await searchParams;
  const result = await loadSpeakersAdmin({
    cursor,
    limit: 50,
    search,
  });

  return (
    <ManageTable
      continueCursor={result.continueCursor}
      cursor={cursor}
      emptyAction={<NewSpeakerButton />}
      isDone={result.isDone}
      isEmpty={result.speakers.length === 0}
      isFiltered={Boolean(search?.trim())}
      itemCount={result.speakers.length}
      resource="speakers"
    >
      {result.speakers.map(({ clipCount, speaker, status, talkCount }) => (
        <SpeakersTableRow
          clipCount={clipCount}
          key={speaker._id}
          speaker={speaker}
          status={status}
          talkCount={talkCount}
        />
      ))}
    </ManageTable>
  );
}
