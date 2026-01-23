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

interface AdminTalksTableProps {
  talks: TalkWithSpeakerAndTopics[];
}

export function TalksTable({ talks }: AdminTalksTableProps) {
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
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <span className="sr-only">Status</span>
            </TableHead>
            <TableHead>
              <span className="sr-only">Content</span>
            </TableHead>
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
