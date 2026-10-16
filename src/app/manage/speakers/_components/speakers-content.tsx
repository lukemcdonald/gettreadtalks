import { ManageTable } from '@/app/manage/_components/manage-table';
import { NewSpeakerButton } from '@/features/speakers/components/new-speaker-button';
import { SpeakersTableRow } from '@/features/speakers/components/speakers-table/speakers-table-row';
import { loadSpeakersAdmin } from '@/features/speakers/queries/load-speakers-admin';

export async function ManageSpeakersContent() {
  const { speakers } = await loadSpeakersAdmin();

  return (
    <ManageTable
      emptyAction={<NewSpeakerButton />}
      isEmpty={speakers.length === 0}
      resource="speakers"
    >
      {speakers.map(({ clipCount, speaker, status, talkCount }) => (
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
