import type { Speaker } from '@/features/speakers/types';

import { SearchIcon } from 'lucide-react';

import { SidebarContent } from '@/components/sidebar-content';
import { ComboboxMultiFilter } from '@/components/ui/combobox-multi-filter';
import { SortSelect } from '@/components/ui/sort-select';
import { getSpeakerName } from '@/features/speakers/utils';

interface ClipsSidebarProps {
  speakers: Speaker[];
}

export function ClipsSidebar({ speakers }: ClipsSidebarProps) {
  return (
    <SidebarContent className="space-y-4">
      <ComboboxMultiFilter
        label="Speakers"
        name="speakers"
        options={speakers.map((speaker) => ({
          label: getSpeakerName(speaker),
          value: speaker.slug,
        }))}
        placeholder="All Speakers"
        startAddon={<SearchIcon />}
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
