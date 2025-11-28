import type { Speaker } from '@/features/speakers/types';

import { SearchInput } from '@/components/search-input';
import { SelectFilter } from '@/components/select-filter';
import { SidebarContent } from '@/components/sidebar-content';
import { SortSelect } from '@/components/sort-select';
import { getSpeakerName } from '@/features/speakers';

type CollectionsSidebarProps = {
  speakersWithCollections: Speaker[];
};

export function CollectionsSidebar({ speakersWithCollections }: CollectionsSidebarProps) {
  return (
    <>
      <header className="space-y-2">
        <h2 className="font-semibold text-2xl">Collections</h2>
        <p className="text-muted-foreground text-sm">
          Each series includes talks given by one or more speakers on the same topic or book of the
          Bible.
        </p>
      </header>
      <SidebarContent>
        <div className="space-y-2">
          <SearchInput paramName="search" placeholder="Search collections..." />
          <SelectFilter
            options={speakersWithCollections.map((speaker) => ({
              label: getSpeakerName(speaker),
              value: speaker.slug,
            }))}
            paramName="speaker"
            placeholder="All Speakers"
          />
          <SortSelect
            options={[
              { label: 'Most Talks', value: 'most-talks' },
              { label: 'Least Talks', value: 'least-talks' },
              { label: 'Alphabetical', value: 'alphabetical' },
            ]}
          />
        </div>
      </SidebarContent>
    </>
  );
}
