import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { SidebarFiltersSkeleton } from '@/components/skeletons';
import { TopicsListSkeleton } from '@/features/topics/components/topics-list-skeleton';

export default function TopicsLoading() {
  return (
    <SidebarLayout
      content={<TopicsListSkeleton />}
      header={
        <PageHeader
          description="Explore talks organized by topic and theme."
          title="Topics"
          variant="lg"
        />
      }
      sidebar={<SidebarFiltersSkeleton />}
      sidebarSticky
    />
  );
}
