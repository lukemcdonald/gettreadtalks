import type { Speaker } from '@/features/speakers/types';
import type { Topic } from '@/features/topics/types';

import { SidebarContent } from '@/components/sidebar-content';
import { ComboboxMultiFilter } from '@/components/ui/combobox-multi-filter';
import { SearchInput } from '@/components/ui/search-input';
import { SortSelect } from '@/components/ui/sort-select';
import { getSpeakerName } from '@/features/speakers';

interface TopicWithCount {
  count: number;
  topic: Topic;
}

interface TalksSidebarProps {
  speakers: Speaker[];
  topics: TopicWithCount[];
}

export function TalksSidebar({ speakers, topics }: TalksSidebarProps) {
  return (
    <SidebarContent className="space-y-4">
      <SearchInput label="Search" paramName="search" placeholder="Search talks..." />
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
          { label: 'Featured', value: 'featured' },
          { label: 'Oldest First', value: 'oldest' },
          { label: 'Alphabetical', value: 'alphabetical' },
        ]}
      />
    </SidebarContent>
  );
}
