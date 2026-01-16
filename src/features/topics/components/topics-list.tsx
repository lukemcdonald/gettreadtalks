import type { Topic } from '@/features/topics/types';

import { GridList } from '@/components/grid-list';
import { TopicCard } from './topic-card';

type TopicWithCount = {
  count: number;
  topic: Pick<Topic, 'slug' | 'title'>;
};

type TopicsListProps = {
  topics: TopicWithCount[];
};

/**
 * Renders a grid of topic cards.
 * Returns null when empty - parent components handle empty state.
 */
export function TopicsList({ topics }: TopicsListProps) {
  if (topics.length === 0) {
    return null;
  }

  return (
    <GridList>
      {topics.map((item) => (
        <TopicCard key={item.topic.slug} talkCount={item.count} topic={item.topic} />
      ))}
    </GridList>
  );
}
