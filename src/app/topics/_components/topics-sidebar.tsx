import type { Topic } from '@/features/topics/types';

import { BrowseFilters } from '@/components/browse-filters';
import { ComboboxMultiFilter } from '@/components/ui';

interface TopicWithCount {
  talkCount: number;
  topic: Pick<Topic, 'slug' | 'title'>;
}

interface TopicsSidebarProps {
  topics: TopicWithCount[];
}

export function TopicsSidebar({ topics }: TopicsSidebarProps) {
  const topicOptions = topics.map(({ topic }) => ({
    label: topic.title,
    value: topic.slug,
  }));

  return (
    <BrowseFilters>
      <ComboboxMultiFilter
        label="Topics"
        name="topics"
        options={topicOptions}
        placeholder="All Topics"
      />
    </BrowseFilters>
  );
}
