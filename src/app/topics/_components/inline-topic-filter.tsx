'use client';

import type { Topic } from '@/features/topics/types';

import { InlineMultiFilter } from '@/components/ui/inline-multi-filter';

interface InlineTopicFilterProps {
  topics: Pick<Topic, 'slug' | 'title'>[];
}

/**
 * Inline topic filter embedded in description text.
 * Uses InlineMultiFilter for compact Group-based display.
 */
export function InlineTopicFilter({ topics }: InlineTopicFilterProps) {
  return (
    <InlineMultiFilter
      name="topics"
      options={topics.map((topic) => ({
        label: topic.title,
        value: topic.slug,
      }))}
      placeholder="all topics"
    />
  );
}
