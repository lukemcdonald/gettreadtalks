import type { Speaker } from '@/features/speakers/types';

import { SidebarContent } from '@/components/sidebar-content';
import { SelectFilter } from '@/components/ui/select-filter';
import { SortSelect } from '@/components/ui/sort-select';
import { getSpeakerName } from '@/features/speakers/utils';

interface CollectionsSidebarProps {
  speakers: Speaker[];
}

export function CollectionsSidebar({ speakers }: CollectionsSidebarProps) {
  return (
    <SidebarContent className="space-y-4">
      <SelectFilter
        label="Speaker"
        name="speakerSlug"
        options={speakers.map((speaker) => ({
          label: getSpeakerName(speaker),
          value: speaker.slug,
        }))}
        placeholder="All Speakers"
      />
      <SortSelect
        label="Sort by"
        options={[
          { label: 'Alphabetical', value: 'alphabetical' },
          { label: 'Most Talks', value: 'most-talks' },
          { label: 'Least Talks', value: 'least-talks' },
        ]}
      />
    </SidebarContent>
  );
}
