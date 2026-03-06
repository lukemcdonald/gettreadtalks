'use client';

import type { TalkWithSpeaker } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';

import { useSearchParams } from 'next/navigation';

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
  const selectedTopics = searchParams.get('topics')?.split(',').filter(Boolean) ?? [];

  const filteredTopics =
    selectedTopics.length > 0
      ? topics.filter((item) => selectedTopics.includes(item.topic.slug))
      : topics;

  if (filteredTopics.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          {selectedTopics.length > 0
            ? 'No topics match your filter.'
            : 'No topics available at this time.'}
        </p>
      </div>
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
