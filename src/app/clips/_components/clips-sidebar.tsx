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

type ClipsSidebarProps = {
  speakersWithClips: Speaker[];
  topics: TopicWithCount[];
};

export function ClipsSidebar({ speakersWithClips, topics }: ClipsSidebarProps) {
  return (
    <SidebarContent className="space-y-4">
      <SearchInput label="Search" paramName="search" placeholder="Search clips..." />
      <SelectFilter
        label="Speaker"
        options={speakersWithClips.map((speaker) => ({
          label: getSpeakerName(speaker),
          value: speaker.slug,
        }))}
        paramName="speaker"
        placeholder="All Speakers"
      />
      <SelectFilter
        label="Topic"
        options={topics.map(({ topic }) => ({
          label: topic.title,
          value: topic.slug,
        }))}
        paramName="topic"
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
