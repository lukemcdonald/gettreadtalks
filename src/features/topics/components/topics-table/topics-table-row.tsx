import type { Topic } from '@/features/topics/types';

import { Badge, TableCell, TableRow } from '@/components/ui';
import { TopicActionsMenu } from '@/features/topics/components/topic-actions-menu';
import { pluralize } from '@/utils';

interface TopicsTableRowProps {
  talkCount: number;
  topic: Topic;
}

function TalkCountBadge({ count }: { count: number }) {
  return (
    <Badge variant="secondary">
      {count === 0 ? 'No talks' : `${count} ${pluralize(count, 'talk', 'talks')}`}
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
