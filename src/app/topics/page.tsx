import { TopicsContent } from '@/app/topics/_components/topics-content';
import { TopicsSidebar } from '@/app/topics/_components/topics-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getTopicsWithCounts } from '@/features/topics';

export interface TopicsPageSearchParams {
  search?: string;
  sort?: string;
}

interface TopicsPageProps {
  searchParams: Promise<TopicsPageSearchParams>;
}

export default async function TopicsPage({ searchParams }: TopicsPageProps) {
  const params = await searchParams;
  const { search, sort } = params;

  const topics = await getTopicsWithCounts({ search, sort });

  return (
    <SidebarLayout
      content={<TopicsContent hasActiveFilters={!!search} topics={topics} />}
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
