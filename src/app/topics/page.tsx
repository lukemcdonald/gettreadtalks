import { Suspense } from 'react';

import { PageLayout } from '@/components/page-layout';
import { SearchInput } from '@/components/search-input';
import { SidebarContent } from '@/components/sidebar-content';
import { SortSelect } from '@/components/sort-select';
import { getTopicsWithCounts } from '@/features/topics';
import { TopicsList } from './_components/topics-list';

export default async function TopicsPage() {
  const topics = await getTopicsWithCounts();

  return (
    <PageLayout>
      <PageLayout.Sidebar>
        <header className="space-y-2">
          <h2 className="font-semibold text-2xl">Topics</h2>
          <p className="text-muted-foreground text-sm">
            Explore talks organized by topic and theme.
          </p>
        </header>
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
      </PageLayout.Sidebar>
      <PageLayout.Content>
        <Suspense>
          <TopicsList topics={topics} />
        </Suspense>
      </PageLayout.Content>
    </PageLayout>
  );
}
