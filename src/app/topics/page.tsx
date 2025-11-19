import { Suspense } from 'react';

import { ArchiveLayout } from '@/components/layouts/archive-layout';
import { ArchiveSidebar } from '@/components/layouts/archive-sidebar';
import { SidebarContent } from '@/components/layouts/sidebar-content';
import { SearchInput } from '@/components/search-input';
import { SortSelect } from '@/components/sort-select';
import { getTopicsWithCounts } from '@/features/topics';
import { TopicsList } from './_components/topics-list';

export default async function TopicsPage() {
  const topics = await getTopicsWithCounts();

  return (
    <ArchiveLayout
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
    </ArchiveLayout>
  );
}
