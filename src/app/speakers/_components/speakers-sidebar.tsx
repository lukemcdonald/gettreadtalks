import type { SpeakerRole } from '@/convex/model/speakers/validators';

import { BrowseFilters } from '@/components/browse-filters';
import { SelectFilter, SortSelect } from '@/components/ui';

interface SpeakersSidebarProps {
  roles: SpeakerRole[];
}

export function SpeakersSidebar({ roles }: SpeakersSidebarProps) {
  const roleOptions = roles.map((role) => ({ label: role, value: role }));
  const sortOptions = [
    { label: 'Alphabetical', value: 'alphabetical' },
    { label: 'Featured', value: 'featured' },
  ];

  return (
    <BrowseFilters
      search={{ paramName: 'search', placeholder: 'Search speakers...' }}
    >
      <SelectFilter
        label="Role"
        name="role"
        options={roleOptions}
        placeholder="All Roles"
      />
      <SortSelect label="Sort by" options={sortOptions} />
    </BrowseFilters>
  );
}
