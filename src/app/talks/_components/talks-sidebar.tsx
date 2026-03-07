import type { Speaker } from '@/features/speakers/types';
import type { Topic } from '@/features/topics/types';

import { SidebarContent } from '@/components/sidebar-content';
import { ComboboxMultiFilter } from '@/components/ui/combobox-multi-filter';
import { MobileFilterSheet } from '@/components/ui/mobile-filter-sheet';
import { SearchInput } from '@/components/ui/search-input';
import { SortSelect } from '@/components/ui/sort-select';
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
    <SidebarContent className="space-y-4">
      {/* Mobile: inline search + icon filter button */}
      <div className="flex items-center gap-2 md:hidden">
        <SearchInput className="flex-1" paramName="search" placeholder="Search talks..." />
        <MobileFilterSheet variant="icon">
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
        </MobileFilterSheet>
      </div>

      {/* Desktop: full sidebar */}
      <div className="hidden md:flex md:flex-col md:gap-4">
        <SearchInput label="Search" paramName="search" placeholder="Search talks..." />
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
      </div>
    </SidebarContent>
  );
}
