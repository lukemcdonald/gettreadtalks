import { SidebarLayout } from '@/components/layouts';
import { SidebarContent } from '@/components/sidebar-content';
import { Skeleton } from '@/components/ui';

function ClipHeaderSkeleton() {
  return (
    <header className="flex flex-col gap-4">
      <div className="max-w-prose space-y-2">
        <Skeleton className="h-10 w-2/3" />
      </div>
    </header>
  );
}

function ClipContentSkeleton() {
  return (
    <div className="space-y-4">
      {/* Media embed */}
      <Skeleton className="aspect-video w-full rounded-lg" />
      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  );
}

function ClipSidebarSkeleton() {
  return (
    <>
      <SidebarContent title="Speaker">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
      </SidebarContent>

      <SidebarContent title="Related Talk">
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-20" />
        </div>
      </SidebarContent>
    </>
  );
}

export default function ClipLoading() {
  return (
    <SidebarLayout
      content={<ClipContentSkeleton />}
      header={<ClipHeaderSkeleton />}
      sidebar={<ClipSidebarSkeleton />}
    />
  );
}
