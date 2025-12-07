import type { Speaker } from '@/features/speakers/types';

import { PageHeader } from '@/components/page-header';
import { SearchInput } from '@/components/search-input';
import { SelectFilter } from '@/components/select-filter';
import { SidebarContent } from '@/components/sidebar-content';
import { SortSelect } from '@/components/sort-select';

type SpeakersSidebarProps = {
  speakers: Speaker[];
};

export function SpeakersSidebar({ speakers }: SpeakersSidebarProps) {
  // Get unique roles for filter: (r): r is string => !!r)
  const roles = Array.from(
    new Set(speakers.map(({ role }) => role).filter((role): role is string => Boolean(role))),
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
      </SidebarContent>
    </>
  );
}
