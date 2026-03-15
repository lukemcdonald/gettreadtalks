import type { ClipWithSpeaker } from '@/features/clips/types';

import {
  Empty,
  EmptyDescription,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
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
          {clips.map((clip) => (
            <ClipsTableRow clip={clip} key={clip._id} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
