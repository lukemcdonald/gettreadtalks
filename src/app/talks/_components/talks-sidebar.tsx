import type { Speaker } from '@/features/speakers/types';
import type { Topic } from '@/features/topics/types';

import { BrowseFilters } from '@/components/browse-filters';
import { ComboboxMultiFilter, SelectFilter, SortSelect } from '@/components/ui';
import { talkFormats } from '@/convex/model/talks/validators';
import { getSpeakerName } from '@/features/speakers/utils';
import { formatTalkFormat } from '@/features/talks/utils';

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

  const formatOptions = talkFormats.map((format) => ({
    label: formatTalkFormat(format),
    value: format,
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
      <SelectFilter
        label="Format"
        name="format"
        options={formatOptions}
        placeholder="All Formats"
      />
      <SortSelect label="Sort by" options={sortOptions} />
    </BrowseFilters>
  );
}
