import { SidebarLayout } from '@/components/layouts';
import { SidebarContent } from '@/components/sidebar-content';
import { MediaCardSkeleton } from '@/components/skeletons';
import { Skeleton } from '@/components/ui';
import { TalksListSkeleton } from '@/features/talks/components/talks-list-skeleton';

function CollectionHeaderSkeleton() {
  return (
    <header className="flex flex-col gap-4">
      <div className="max-w-prose space-y-2">
        <Skeleton className="h-14 w-1/2 lg:h-16" />
        <Skeleton className="mt-4 h-6 w-3/4" />
      </div>
    </header>
  );
}

function CollectionSidebarSkeleton() {
  return (
    <SidebarContent title="Speakers">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-36" />
      </div>
    </SidebarContent>
  );
}

export default function CollectionLoading() {
  return (
    <SidebarLayout
      content={<TalksListSkeleton />}
      header={<CollectionHeaderSkeleton />}
      sidebar={<CollectionSidebarSkeleton />}
    />
  );
}
