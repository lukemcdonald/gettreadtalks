import type { Speaker } from '@/features/speakers/types';
import type { Topic } from '@/features/topics/types';

import { BrowseFilters } from '@/components/browse-filters';
import { ComboboxMultiFilter, SortSelect } from '@/components/ui';
import { getSpeakerName } from '@/features/speakers/utils';

interface TopicWithCount {
  count: number;
  topic: Topic;
}

interface TalksSidebarProps {
  speakers: Speaker[];
  topics: TopicWithCount[];
}

export function TalksSidebar({ speakers, topics }: TalksSidebarProps) {
  const speakerOptions = speakers.map((speaker) => ({
    label: getSpeakerName(speaker),
    value: speaker.slug,
  }));

  const topicOptions = topics.map(({ topic }) => ({
    label: topic.title,
    value: topic.slug,
  }));

  const sortOptions = [
    { label: 'Recently Added', value: 'recent' },
    { label: 'Featured', value: 'featured' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Alphabetical', value: 'alphabetical' },
  ];

  return (
    <BrowseFilters
      search={{ paramName: 'search', placeholder: 'Search talks...' }}
    >
      <ComboboxMultiFilter
        label="Speakers"
        name="speakers"
        options={speakerOptions}
        placeholder="All Speakers"
      />
      <ComboboxMultiFilter
        label="Topics"
        name="topics"
        options={topicOptions}
        placeholder="All Topics"
      />
      <SortSelect label="Sort by" options={sortOptions} />
    </BrowseFilters>
  );
}
