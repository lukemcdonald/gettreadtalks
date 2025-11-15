import { Suspense } from 'react';

import { FilterBar, SearchInput, SortSelect } from '@/components/filters';
import { ListPageLayout, SectionContainer } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getTopicsWithCounts } from '@/lib/features/topics';
import { TopicsList } from './_components/topics-list';

function TopicsListSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

export default async function TopicsPage() {
  const topics = await getTopicsWithCounts();

  return (
    <ListPageLayout>
      <SectionContainer>
        <PageHeader
          description="Explore talks organized by topic and theme."
          title="Topics"
        />

        <div className="space-y-6">
          <FilterBar>
            <SearchInput label="Search" paramName="search" placeholder="Search topics..." />
            <SortSelect
              label="Sort by"
              options={[
                { label: 'Most Talks', value: 'most-talks' },
                { label: 'Least Talks', value: 'least-talks' },
                { label: 'Alphabetical', value: 'alphabetical' },
              ]}
            />
          </FilterBar>

          <Suspense fallback={<TopicsListSkeleton />}>
            <TopicsList topics={topics} />
          </Suspense>
        </div>
      </SectionContainer>
    </ListPageLayout>
  );
}
