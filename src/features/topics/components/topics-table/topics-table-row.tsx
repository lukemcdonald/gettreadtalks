import type { Topic } from '@/features/topics/types';

import {
  ManageCountCell,
  ManageRow,
} from '@/app/manage/_components/manage-table';
import { TopicActionsMenu } from '@/features/topics/components/topic-actions-menu';
import { getTopicUrl } from '@/features/topics/utils';
import { getEntityEditPath } from '@/lib/entities/paths';

interface TopicsTableRowProps {
  talkCount: number;
  topic: Topic;
}

export function TopicsTableRow({ talkCount, topic }: TopicsTableRowProps) {
  const editPath = getEntityEditPath('topics', topic._id);
  const viewUrl = talkCount > 0 ? getTopicUrl(topic.slug) : undefined;

  return (
    <ManageRow
      actions={
        <TopicActionsMenu
          talkCount={talkCount}
          topic={topic}
          viewUrl={viewUrl}
        />
      }
      editHref={editPath}
      title={topic.title}
    >
      <ManageCountCell>{talkCount}</ManageCountCell>
    </ManageRow>
  );
}
