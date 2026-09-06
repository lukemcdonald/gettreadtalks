import type { Speaker } from '@/features/speakers/types';

import { BrowseFilters } from '@/components/browse-filters';
import { SelectFilter, SortSelect } from '@/components/ui';
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
    <BrowseFilters>
      <SelectFilter
        label="Speaker"
        name="speaker"
        options={speakerOptions}
        placeholder="All Speakers"
      />
      <SortSelect label="Sort by" options={sortOptions} />
    </BrowseFilters>
  );
}
