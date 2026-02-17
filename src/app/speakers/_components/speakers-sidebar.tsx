import type { SpeakerRole } from '@/convex/model/speakers/validators';
import type { Speaker } from '@/features/speakers/types';

import { SidebarContent } from '@/components/sidebar-content';
import { MobileFilterSheet } from '@/components/ui/mobile-filter-sheet';
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

  const roleOptions = roles.map((role) => ({ label: role, value: role }));

  const sortOptions = [
    { label: 'Alphabetical', value: 'alphabetical' },
    { label: 'Featured', value: 'featured' },
  ];

  return (
    <SidebarContent className="space-y-4">
      {/* Mobile: inline search + icon filter button */}
      <div className="flex items-center gap-2 md:hidden">
        <SearchInput className="flex-1" paramName="search" placeholder="Search speakers..." />
        <MobileFilterSheet iconOnly>
          <SelectFilter label="Role" name="role" options={roleOptions} placeholder="All Roles" />
          <SortSelect label="Sort by" options={sortOptions} />
        </MobileFilterSheet>
      </div>

      {/* Desktop: full sidebar */}
      <div className="hidden md:flex md:flex-col md:gap-4">
        <SearchInput label="Search" paramName="search" placeholder="Search speakers..." />
        <SelectFilter label="Role" name="role" options={roleOptions} placeholder="All Roles" />
        <SortSelect label="Sort by" options={sortOptions} />
      </div>
    </SidebarContent>
  );
}
