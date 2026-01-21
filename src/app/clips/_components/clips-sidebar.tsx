import type { Speaker } from '@/features/speakers/types';
import type { Topic } from '@/features/topics/types';

import { ComboboxMultiFilter } from '@/components/combobox-multi-filter';
import { SearchInput } from '@/components/search-input';
import { SidebarContent } from '@/components/sidebar-content';
import { SortSelect } from '@/components/sort-select';
import { getSpeakerName } from '@/features/speakers';

interface TopicWithCount {
  count: number;
  topic: Topic;
}

interface ClipsSidebarProps {
  speakers: Speaker[];
  topics: TopicWithCount[];
}

export function ClipsSidebar({ speakers, topics }: ClipsSidebarProps) {
  return (
    <SidebarContent className="space-y-4">
      <SearchInput label="Search" paramName="search" placeholder="Search clips..." />
      <ComboboxMultiFilter
        label="Speakers"
        name="speakers"
        options={speakers.map((speaker) => ({
          label: getSpeakerName(speaker),
          value: speaker.slug,
        }))}
        placeholder="All Speakers"
      />
      <ComboboxMultiFilter
        label="Topics"
        name="topics"
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
