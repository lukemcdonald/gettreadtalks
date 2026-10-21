import type { TalkWithoutTranscript } from '@/features/talks/types';

import { ManageTable, ManageTitleLink } from '@/components/manage-table';
import { TableCell, TableRow } from '@/components/ui';
import { loadTalksWithoutTranscript } from '@/features/talks/queries/load-talks-without-transcript';
import {
  buildTalkStudyPath,
  formatTranscriptFetchFailure,
} from '@/features/talks/utils';

function getLastErrorText(talk: TalkWithoutTranscript) {
  return formatTranscriptFetchFailure(talk.lastError ?? {}) ?? '—';
}

export async function TranscriptQueue() {
  const talks = await loadTalksWithoutTranscript();

  return (
    <ManageTable isEmpty={talks.length === 0} resource="transcripts">
      {talks.map((talk) => (
        <TableRow className="relative min-h-11" key={talk._id}>
          <TableCell className="whitespace-normal">
            <ManageTitleLink
              href={buildTalkStudyPath(talk._id)}
              title={talk.title}
            />
          </TableCell>
          <TableCell className="text-muted-foreground whitespace-normal">
            {getLastErrorText(talk)}
          </TableCell>
        </TableRow>
      ))}
    </ManageTable>
  );
}
