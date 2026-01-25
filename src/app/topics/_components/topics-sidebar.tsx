import { SidebarContent } from '@/components/sidebar-content';
import { SearchInput } from '@/components/ui/search-input';
import { SortSelect } from '@/components/ui/sort-select';

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
