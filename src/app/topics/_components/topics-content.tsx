import type { Topic } from '@/features/topics/types';

import { ListEmpty } from '@/components/list-empty';
import { TopicsList } from '@/features/topics/components/topics-list';

interface TopicWithCount {
  count: number;
  topic: Topic;
}

interface TopicsContentProps {
  hasActiveFilters: boolean;
  topics: TopicWithCount[];
}

export function TopicsContent({ hasActiveFilters, topics }: TopicsContentProps) {
  if (topics.length === 0) {
    return (
      <ListEmpty
        clearPath="/topics"
        description="There are no topics available at this time."
        filteredDescription="No topics match your current search. Try adjusting your search or clearing filters."
        hasActiveFilters={hasActiveFilters}
        title="No topics found"
      />
    );
  }

  return <TopicsList topics={topics} />;
}
