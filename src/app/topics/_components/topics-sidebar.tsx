import { SearchInput } from '@/components/search-input';
import { SidebarContent } from '@/components/sidebar-content';
import { SortSelect } from '@/components/sort-select';

export function TopicsSidebar() {
  return (
    <SidebarContent className="space-y-4">
      <SearchInput label="Search" paramName="search" placeholder="Search topics..." />
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
