import type { SpeakerRole } from '@/convex/model/speakers/validators';
import type { Speaker } from '@/features/speakers/types';

import { PageHeader } from '@/components/page-header';
import { SidebarContent } from '@/components/sidebar-content';
import { SearchInput } from '@/components/ui/search-input';
import { SelectFilter } from '@/components/ui/select-filter';
import { SortSelect } from '@/components/ui/sort-select';

interface SpeakersSidebarProps {
  speakers: Speaker[];
}

export function SpeakersSidebar({ speakers }: SpeakersSidebarProps) {
  const roles = Array.from(
    new Set(speakers.map(({ role }) => role).filter((role): role is SpeakerRole => !!role)),
  ).sort();

  return (
    <>
      <PageHeader
        description="Listen to faithful ambassadors of Christ and be blessed."
        title="Speakers"
      />
      <SidebarContent>
        <SearchInput label="Search" paramName="search" placeholder="Search speakers..." />
        <SelectFilter
          label="Role"
          name="role"
          options={roles.map((role) => ({ label: role, value: role }))}
          placeholder="All Roles"
        />
        <SortSelect
          label="Sort by"
          options={[
            { label: 'Alphabetical', value: 'alphabetical' },
            { label: 'Featured', value: 'featured' },
          ]}
        />
      </SidebarContent>
    </>
  );
}
