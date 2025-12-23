'use client';

import type { Topic } from '@/features/topics/types';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { GridList } from '@/components/grid-list';
import { Empty, EmptyDescription } from '@/components/ui';
import { TopicCard } from './topic-card';

type TopicWithCount = {
  count: number;
  topic: Pick<Topic, 'slug' | 'title'>;
};

type TopicsListProps = {
  topics: TopicWithCount[];
  /**
   * If true, enables filtering and sorting via URL search params.
   * If false, displays topics as-is without filtering.
   * @default true
   */
  enableFiltering?: boolean;
};

export function TopicsList({ topics, enableFiltering = true }: TopicsListProps) {
  const searchParams = useSearchParams();
  const search = enableFiltering ? searchParams.get('search')?.toLowerCase() || '' : '';
  const sort = enableFiltering ? searchParams.get('sort') || 'alphabetical' : 'alphabetical';

  const filteredAndSorted = useMemo(() => {
    let filtered = topics;

    // Filter by search
    if (search) {
      filtered = filtered.filter((item) => item.topic.title.toLowerCase().includes(search));
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'most-talks':
          return b.count - a.count;
        case 'least-talks':
          return a.count - b.count;
        default:
          return a.topic.title.localeCompare(b.topic.title);
      }
    });

    return sorted;
  }, [topics, search, sort]);

  if (filteredAndSorted.length === 0) {
    return (
      <Empty>
        <EmptyDescription>No topics found</EmptyDescription>
      </Empty>
    );
  }

  return (
    <GridList>
      {filteredAndSorted.map((item) => (
        <TopicCard key={item.topic.slug} talkCount={item.count} topic={item.topic} />
      ))}
    </GridList>
  );
}
