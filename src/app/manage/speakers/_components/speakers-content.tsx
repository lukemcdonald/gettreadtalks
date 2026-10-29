import { ManageTable } from '@/components/manage-table';
import { Pagination } from '@/components/pagination';
import { NewSpeakerButton } from '@/features/speakers/components/new-speaker-button';
import { SpeakersTableRow } from '@/features/speakers/components/speakers-table/speakers-table-row';
import { loadSpeakersAdmin } from '@/features/speakers/queries/load-speakers-admin';

export interface ManageSpeakersSearchParams {
  cursor?: string;
  search?: string;
}

interface ManageSpeakersContentProps {
  searchParams: Promise<ManageSpeakersSearchParams>;
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
    <div className="space-y-6">
      <ManageTable
        emptyAction={<NewSpeakerButton />}
        isEmpty={result.speakers.length === 0}
        isFiltered={Boolean(search?.trim())}
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
      <Pagination
        continueCursor={result.continueCursor}
        hasNextPage={!result.isDone}
        hasPrevPage={!!cursor}
        itemCount={result.speakers.length}
      />
    </div>
  );
}
