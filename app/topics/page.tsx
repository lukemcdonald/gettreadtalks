import { Suspense } from 'react';

import { SearchInput, SortSelect } from '@/components/filters';
import { ArchiveLayout, ArchiveSidebar, SidebarContent } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getTopicsWithCounts } from '@/lib/features/topics';
import { TopicsList } from './_components/topics-list';

function TopicsListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton loader items are static and never reordered
        <div className="h-32 animate-pulse rounded-lg bg-muted" key={i} />
      ))}
    </div>
  );
}

export default async function TopicsPage() {
  const topics = await getTopicsWithCounts();
  const totalTopics = topics.length;
  const totalTalks = topics.reduce((sum, item) => sum + item.count, 0);

  return (
    <ArchiveLayout
      header={
        <PageHeader description="Explore talks organized by topic and theme." title="Topics" />
      }
      sidebar={
        <ArchiveSidebar
          description="Explore talks organized by topic and theme."
          meta={[
            { label: 'Topics', value: totalTopics },
            { label: 'Total Talks', value: totalTalks },
          ]}
          title="Topics"
        >
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
      <Suspense fallback={<TopicsListSkeleton />}>
        <TopicsList topics={topics} />
      </Suspense>
    </ArchiveLayout>
  );
}
