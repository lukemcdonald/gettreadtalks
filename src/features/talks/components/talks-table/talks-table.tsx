import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import {
  Empty,
  EmptyDescription,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
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
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader className="sr-only">
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {talks.map((talk) => (
            <TalksTableRow key={talk._id} talk={talk} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
