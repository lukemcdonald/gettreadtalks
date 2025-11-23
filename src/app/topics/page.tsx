import { Suspense } from 'react';

import { ArchiveSidebar } from '@/components/layouts/archive-sidebar';
import { SidebarLayout } from '@/components/layouts/sidebar-layout';
import { SearchInput } from '@/components/search-input';
import { SidebarContent } from '@/components/sidebar-content';
import { SortSelect } from '@/components/sort-select';
import { getTopicsWithCounts } from '@/features/topics';
import { TopicsList } from './_components/topics-list';

export default async function TopicsPage() {
  const topics = await getTopicsWithCounts();

  return (
    <SidebarLayout
      sidebar={
        <ArchiveSidebar description="Explore talks organized by topic and theme." title="Topics">
          <SidebarContent title="Filters">
            <div className="space-y-4">
              <SearchInput label="Search" paramName="search" placeholder="Search topics..." />
              <SortSelect
                label="Sort by"
                options={[
                  { label: 'Most Talks', value: 'most-talks' },
                  { label: 'Least Talks', value: 'least-talks' },
                  { label: 'Alphabetical', value: 'alphabetical' },
                ]}
              />
            </div>
          </SidebarContent>
        </ArchiveSidebar>
      }
    >
      <Suspense>
        <TopicsList topics={topics} />
      </Suspense>
    </SidebarLayout>
  );
}
