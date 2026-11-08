import { ManageTable } from '@/components/manage-table';
import { TalksTableRow } from '@/features/talks/components/talks-table/talks-table-row';
import { loadAllTalks } from '@/features/talks/queries/load-all-talks';
import { buildTalkStudyPath } from '@/features/talks/utils';
import { parseStudyStatus } from '@/lib/entities/manage-status';

export interface ManageStudiesSearchParams {
  cursor?: string;
  search?: string;
  study?: 'draft' | 'published';
}

interface ManageStudiesContentProps {
  searchParams: Promise<ManageStudiesSearchParams>;
}

export async function ManageStudiesContent({
  searchParams,
}: ManageStudiesContentProps) {
  const { cursor, search, study: studyParam } = await searchParams;
  const study = parseStudyStatus(studyParam);
  const result = await loadAllTalks({
    cursor,
    limit: 50,
    search,
    status: 'all',
    studyStatus: study,
  });

  return (
    <ManageTable
      continueCursor={result.continueCursor}
      cursor={cursor}
      isDone={result.isDone}
      isEmpty={result.talks.length === 0}
      isFiltered={Boolean(search?.trim()) || study !== 'draft'}
      itemCount={result.talks.length}
      resource="studies"
    >
      {result.talks.map((talk) => (
        <TalksTableRow
          actions={null}
          editHref={buildTalkStudyPath(talk._id)}
          key={talk._id}
          status={study}
          talk={talk}
        />
      ))}
    </ManageTable>
  );
}
