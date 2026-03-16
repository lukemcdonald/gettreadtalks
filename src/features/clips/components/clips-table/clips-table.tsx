import type { ClipWithSpeaker } from '@/features/clips/types';

import { ContentTable } from '@/components/content-table';
import { Empty, EmptyDescription } from '@/components/ui';
import { ClipsTableRow } from './clips-table-row';

interface ClipsTableProps {
  clips: ClipWithSpeaker[];
}

export function ClipsTable({ clips }: ClipsTableProps) {
  if (clips.length === 0) {
    return (
      <Empty>
        <EmptyDescription>No clips found</EmptyDescription>
      </Empty>
    );
  }

  return (
    <ContentTable columns={['Status', 'Title', 'Actions']}>
      {clips.map((clip) => (
        <ClipsTableRow clip={clip} key={clip._id} />
      ))}
    </ContentTable>
  );
}
