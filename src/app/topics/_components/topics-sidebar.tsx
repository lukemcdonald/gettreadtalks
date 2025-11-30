import { PageHeader } from '@/components/page-header';
import { SearchInput } from '@/components/search-input';
import { SidebarContent } from '@/components/sidebar-content';
import { SortSelect } from '@/components/sort-select';

export function TopicsSidebar() {
  return (
    <>
      <PageHeader
        description="Explore talks organized by topic and theme."
        title="Topics"
        variant="lg"
      />
      <SidebarContent title="Filters">
        <SearchInput label="Search" paramName="search" placeholder="Search topics..." />
        <SortSelect
          label="Sort by"
          options={[
            { label: 'Most Talks', value: 'most-talks' },
            { label: 'Least Talks', value: 'least-talks' },
            { label: 'Alphabetical', value: 'alphabetical' },
          ]}
        />
      </SidebarContent>
    </>
  );
}
