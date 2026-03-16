import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { ContentTable } from '@/components/content-table';
import { Empty, EmptyDescription } from '@/components/ui';
import { TalksTableRow } from './talks-table-row';

interface TalksTableProps {
  talks: TalkWithSpeakerAndTopics[];
}

export function TalksTable({ talks }: TalksTableProps) {
  if (talks.length === 0) {
    return (
      <Empty>
        <EmptyDescription>No talks found</EmptyDescription>
      </Empty>
    );
  }

  return (
    <ContentTable columns={['Status', 'Title', 'Actions']}>
      {talks.map((talk) => (
        <TalksTableRow key={talk._id} talk={talk} />
      ))}
    </ContentTable>
  );
}
