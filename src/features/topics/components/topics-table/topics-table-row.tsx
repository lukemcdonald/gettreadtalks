import type { Topic } from '@/features/topics/types';

import { Badge, TableCell, TableRow } from '@/components/ui';
import { TopicActionsMenu } from '@/features/topics/components/topic-actions-menu';

interface TopicsTableRowProps {
  talkCount: number;
  topic: Topic;
}

function TalkCountBadge({ count }: { count: number }) {
  if (count === 0) {
    return <Badge variant="secondary">No talks</Badge>;
  }

  return (
    <Badge variant="secondary">
      {count} {count === 1 ? 'talk' : 'talks'}
    </Badge>
  );
}

export function TopicsTableRow({ talkCount, topic }: TopicsTableRowProps) {
  return (
    <TableRow>
      <TableCell className="whitespace-normal font-medium">{topic.title}</TableCell>
      <TableCell className="w-[120px]">
        <TalkCountBadge count={talkCount} />
      </TableCell>
      <TableCell className="w-px text-right">
        <TopicActionsMenu talkCount={talkCount} topic={topic} />
      </TableCell>
    </TableRow>
  );
}
