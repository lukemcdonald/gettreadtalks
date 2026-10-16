import type { Topic } from '@/features/topics/types';

import { CountBadge } from '@/components/count-badge';
import { ManageEditButton } from '@/components/manage-edit-button';
import { TableCell, TableRow } from '@/components/ui';
import { Link } from '@/components/ui/link';
import { TopicActionsMenu } from '@/features/topics/components/topic-actions-menu';
import { getTopicUrl } from '@/features/topics/utils';
import { getEntityEditPath, getManageTitleHref } from '@/lib/entities/paths';

interface TopicsTableRowProps {
  talkCount: number;
  topic: Topic;
}

export function TopicsTableRow({ talkCount, topic }: TopicsTableRowProps) {
  const editPath = getEntityEditPath('topics', topic._id);
  const href = getManageTitleHref({
    editPath,
    publicPath: talkCount > 0 ? getTopicUrl(topic.slug) : undefined,
  });

  return (
    <TableRow>
      <TableCell className="font-medium whitespace-normal">
        <Link className="line-clamp-2 block hover:underline" href={href}>
          {topic.title}
        </Link>
      </TableCell>
      <TableCell className="w-[120px]">
        <CountBadge count={talkCount} label="talk" />
      </TableCell>
      <TableCell className="w-px text-right">
        <div className="flex items-center justify-end gap-1">
          <ManageEditButton entity="topics" id={topic._id} name={topic.title} />
          <TopicActionsMenu talkCount={talkCount} topic={topic} />
        </div>
      </TableCell>
    </TableRow>
  );
}
