'use client';

import type { TalkWithSpeaker } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';

import { useSearchParams } from 'next/navigation';

import { ListEmpty } from '@/components/list-empty';

import { TopicBrowseSection } from './topic-browse-section';

interface TopicWithTalks {
  talkCount: number;
  talks: TalkWithSpeaker[];
  topic: Pick<Topic, 'slug' | 'title'>;
}

interface TopicsBrowseContentProps {
  topics: TopicWithTalks[];
}

export function TopicsBrowseContent({ topics }: TopicsBrowseContentProps) {
  const searchParams = useSearchParams();
  const selectedTopics =
    searchParams.get('topics')?.split(',').filter(Boolean) ?? [];

  const filteredTopics =
    selectedTopics.length > 0
      ? topics.filter((item) => selectedTopics.includes(item.topic.slug))
      : topics;

  if (filteredTopics.length === 0) {
    return (
      <ListEmpty
        clearPath="/topics"
        description="There are no topics available at this time."
        filteredDescription="No topics match your current filters. Try adjusting your selection or clearing filters."
        hasActiveFilters={selectedTopics.length > 0}
        title="No topics found"
      />
    );
  }

  return (
    <div className="space-y-16">
      {filteredTopics.map((item) => (
        <TopicBrowseSection
          key={item.topic.slug}
          talkCount={item.talkCount}
          talks={item.talks}
          topic={item.topic}
        />
      ))}
    </div>
  );
}
