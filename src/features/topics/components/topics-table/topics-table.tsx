import type { Topic } from '@/features/topics/types';

import {
  Empty,
  EmptyDescription,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { TopicsTableRow } from './topics-table-row';

interface TopicsTableProps {
  topics: { talkCount: number; topic: Topic }[];
}

export function TopicsTable({ topics }: TopicsTableProps) {
  if (topics.length === 0) {
    return (
      <Empty>
        <EmptyDescription>No topics found</EmptyDescription>
      </Empty>
    );
  }

  return (
    <Table variant="card">
      <TableHeader className="sr-only">
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Talks</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topics.map(({ talkCount, topic }) => (
          <TopicsTableRow key={topic._id} talkCount={talkCount} topic={topic} />
        ))}
      </TableBody>
    </Table>
  );
}
