import { ManageTable } from '@/app/manage/_components/manage-table';
import { NewSpeakerButton } from '@/features/speakers/components/new-speaker-button';
import { SpeakersTableRow } from '@/features/speakers/components/speakers-table/speakers-table-row';
import { getSpeakersAdmin } from '@/features/speakers/queries/get-speakers-admin';

export async function SpeakersContent() {
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
