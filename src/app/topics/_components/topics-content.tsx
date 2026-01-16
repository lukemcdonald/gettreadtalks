'use client';

import type { Topic } from '@/features/topics/types';

import { useRouter } from 'next/navigation';

import { Button, Empty, EmptyDescription, EmptyTitle } from '@/components/ui';
import { TopicsList } from '@/features/topics/components';

type TopicWithCount = {
  count: number;
  topic: Topic;
};

type TopicsContentProps = {
  hasActiveFilters: boolean;
  topics: TopicWithCount[];
};

export function TopicsContent({ hasActiveFilters, topics }: TopicsContentProps) {
  const router = useRouter();

  function handleClearFilters() {
    router.push('/topics');
  }

  if (topics.length === 0) {
    return (
      <Empty>
        <EmptyTitle>No topics found</EmptyTitle>
        <EmptyDescription>
          {hasActiveFilters
            ? 'No topics match your current search. Try adjusting your search or clearing filters.'
            : 'There are no topics available at this time.'}
        </EmptyDescription>
        {!!hasActiveFilters && (
          <Button className="mt-4" onClick={handleClearFilters} variant="outline">
            Clear all filters
          </Button>
        )}
      </Empty>
    );
  }

  return <TopicsList topics={topics} />;
}
