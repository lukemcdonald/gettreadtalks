'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { GridList } from '@/components/grid-list';
import { TopicCard } from '@/components/topic-card';
import { Empty, EmptyDescription } from '@/components/ui/empty';

type TopicWithCount = {
  count: number;
  topic: {
    _id: string;
    slug: string;
    title: string;
  };
};

type TopicsListProps = {
  topics: TopicWithCount[];
};

export function TopicsList({ topics }: TopicsListProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get('search')?.toLowerCase() || '';
  const sort = searchParams.get('sort') || 'most-talks';

  const filteredAndSorted = useMemo(() => {
    let filtered = topics;

    // Filter by search
    if (search) {
      filtered = filtered.filter((item) => item.topic.title.toLowerCase().includes(search));
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'alphabetical':
          return a.topic.title.localeCompare(b.topic.title);
        case 'most-talks':
          return b.count - a.count;
        case 'least-talks':
          return a.count - b.count;
        default:
          return b.count - a.count;
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
        <TopicCard key={item.topic._id} talkCount={item.count} topic={item.topic} />
      ))}
    </GridList>
  );
}
