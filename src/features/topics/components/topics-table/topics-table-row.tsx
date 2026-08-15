import type { Topic } from '@/features/topics/types';

import { CountBadge } from '@/components/count-badge';
import { TableCell, TableRow } from '@/components/ui';
import { TopicActionsMenu } from '@/features/topics/components/topic-actions-menu';

interface TopicsTableRowProps {
  talkCount: number;
  topic: Topic;
}

export function TopicsTableRow({ talkCount, topic }: TopicsTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium whitespace-normal">
        {topic.title}
      </TableCell>
      <TableCell className="w-[120px]">
        <CountBadge count={talkCount} label="talk" />
      </TableCell>
      <TableCell className="w-px text-right">
        <TopicActionsMenu talkCount={talkCount} topic={topic} />
      </TableCell>
    </TableRow>
  );
}
