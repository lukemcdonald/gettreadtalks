import type { Speaker } from '@/features/speakers/types';

import {
  Empty,
  EmptyDescription,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';

import { SpeakersTableRow } from './speakers-table-row';

interface SpeakersTableProps {
  speakers: { clipCount: number; speaker: Speaker; talkCount: number }[];
}

export function SpeakersTable({ speakers }: SpeakersTableProps) {
  if (speakers.length === 0) {
    return (
      <Empty>
        <EmptyDescription>No speakers found</EmptyDescription>
      </Empty>
    );
  }

  return (
    <Table variant="card">
      <TableHeader className="sr-only">
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Talks</TableHead>
          <TableHead>Clips</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {speakers.map(({ clipCount, speaker, talkCount }) => (
          <SpeakersTableRow
            clipCount={clipCount}
            key={speaker._id}
            speaker={speaker}
            talkCount={talkCount}
          />
        ))}
      </TableBody>
    </Table>
  );
}
