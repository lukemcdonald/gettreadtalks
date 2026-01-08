import type { Speaker } from '@/features/speakers/types';
import type { Topic } from '@/features/topics/types';

import { SearchInput } from '@/components/search-input';
import { SelectFilter } from '@/components/select-filter';
import { SidebarContent } from '@/components/sidebar-content';
import { SortSelect } from '@/components/sort-select';
import { getSpeakerName } from '@/features/speakers';

type TopicWithCount = {
  count: number;
  topic: Topic;
};

type TalksSidebarProps = {
  speakersWithTalks: Speaker[];
  topics: TopicWithCount[];
};

export function TalksSidebar({ speakersWithTalks, topics }: TalksSidebarProps) {
  return (
    <SidebarContent className="space-y-4">
      <SearchInput label="Search" paramName="search" placeholder="Search talks..." />
      <SelectFilter
        label="Speaker"
        name="speaker"
        options={speakersWithTalks.map((speaker) => ({
          label: getSpeakerName(speaker),
          value: speaker.slug,
        }))}
        placeholder="All Speakers"
      />
      <SelectFilter
        label="Topic"
        name="topic"
        options={topics.map(({ topic }) => ({
          label: topic.title,
          value: topic.slug,
        }))}
        placeholder="All Topics"
      />
      <SortSelect
        label="Sort by"
        options={[
          { label: 'Recently Added', value: 'recent' },
          { label: 'Oldest First', value: 'oldest' },
          { label: 'Alphabetical', value: 'alphabetical' },
        ]}
      />
    </SidebarContent>
  );
}
