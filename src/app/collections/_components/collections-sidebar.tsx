import type { Speaker } from '@/features/speakers/types';

import { SidebarContent } from '@/components/sidebar-content';
import { MobileFilterSheet } from '@/components/ui/mobile-filter-sheet';
import { SelectFilter } from '@/components/ui/select-filter';
import { SortSelect } from '@/components/ui/sort-select';
import { getSpeakerName } from '@/features/speakers/utils';

interface CollectionsSidebarProps {
  speakers: Speaker[];
}

export function CollectionsSidebar({ speakers }: CollectionsSidebarProps) {
  const speakerOptions = speakers.map((speaker) => ({
    label: getSpeakerName(speaker),
    value: speaker.slug,
  }));

  const sortOptions = [
    { label: 'Alphabetical', value: 'alphabetical' },
    { label: 'Most Talks', value: 'most-talks' },
    { label: 'Least Talks', value: 'least-talks' },
  ];

  return (
    <SidebarContent className="space-y-4">
      {/* Mobile: compact sheet */}
      <div className="md:hidden">
        <MobileFilterSheet>
          <SelectFilter
            label="Speaker"
            name="speakerSlug"
            options={speakerOptions}
            placeholder="All Speakers"
          />
          <SortSelect label="Sort by" options={sortOptions} />
        </MobileFilterSheet>
      </div>

      {/* Desktop: inline sidebar */}
      <div className="hidden md:flex md:flex-col md:gap-4">
        <SelectFilter
          label="Speaker"
          name="speakerSlug"
          options={speakerOptions}
          placeholder="All Speakers"
        />
        <SortSelect label="Sort by" options={sortOptions} />
      </div>
    </SidebarContent>
  );
}
