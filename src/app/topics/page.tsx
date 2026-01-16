import { TopicsContent } from '@/app/topics/_components/topics-content';
import { TopicsSidebar } from '@/app/topics/_components/topics-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getTopicsWithCounts } from '@/features/topics';

export type TopicsPageSearchParams = {
  search?: string;
  sort?: string;
};

type TopicsPageProps = {
  searchParams: Promise<TopicsPageSearchParams>;
};

export default async function TopicsPage({ searchParams }: TopicsPageProps) {
  const params = await searchParams;
  const { search, sort } = params;

  // Check if any filters are active (for showing "clear filters" option)
  const hasActiveFilters = !!search;

  const topics = await getTopicsWithCounts({ search, sort });

  return (
    <SidebarLayout
      content={<TopicsContent hasActiveFilters={hasActiveFilters} topics={topics} />}
      header={
        <PageHeader
          description="Explore talks organized by topic and theme."
          title="Topics"
          variant="lg"
        />
      }
      sidebar={<TopicsSidebar />}
      sidebarSticky
    />
  );
}
