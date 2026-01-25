import type { Speaker } from '@/features/speakers/types';

import { PageHeader } from '@/components/page-header';
import { SidebarContent } from '@/components/sidebar-content';
import { SearchInput } from '@/components/ui/search-input';
import { SelectFilter } from '@/components/ui/select-filter';
import { SortSelect } from '@/components/ui/sort-select';
import { getSpeakerName } from '@/features/speakers';

interface CollectionsSidebarProps {
  speakers: Speaker[];
}

export function CollectionsSidebar({ speakers }: CollectionsSidebarProps) {
  return (
    <>
      <PageHeader
        description="Each series includes talks given by one or more speakers on the same topic or book of the Bible."
        title="Collections"
      />
      <SidebarContent>
        <div className="space-y-2">
          <SearchInput paramName="search" placeholder="Search collections..." />
          <SelectFilter
            name="speakerSlug"
            options={speakers.map((speaker) => ({
              label: getSpeakerName(speaker),
              value: speaker.slug,
            }))}
            placeholder="All Speakers"
          />
          <SortSelect
            options={[
              { label: 'Alphabetical', value: 'alphabetical' },
              { label: 'Most Talks', value: 'most-talks' },
              { label: 'Least Talks', value: 'least-talks' },
            ]}
          />
        </div>
      </SidebarContent>
    </>
  );
}
