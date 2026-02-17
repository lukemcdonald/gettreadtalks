import { SidebarLayout } from '@/components/layouts';
import { SidebarContent } from '@/components/sidebar-content';
import { Skeleton } from '@/components/ui';
import { TalksListSkeleton } from '@/features/talks/components/talks-list-skeleton';

function TopicHeaderSkeleton() {
  return (
    <header className="flex flex-col gap-4">
      <div className="max-w-prose space-y-2">
        <Skeleton className="h-14 w-1/3 lg:h-16" />
        <Skeleton className="mt-4 h-6 w-2/3" />
      </div>
    </header>
  );
}

function TopicSidebarSkeleton() {
  return (
    <SidebarContent className="space-y-4">
      {/* Search input */}
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-9 w-full" />
      </div>
    </SidebarContent>
  );
}

export default function TopicLoading() {
  return (
    <SidebarLayout
      content={<TalksListSkeleton />}
      header={<TopicHeaderSkeleton />}
      sidebar={<TopicSidebarSkeleton />}
      sidebarSticky
    />
  );
}
