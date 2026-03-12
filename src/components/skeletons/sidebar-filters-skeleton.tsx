import { SidebarContent } from '@/components/sidebar-content';
import { Skeleton } from '@/components/ui';

export function SidebarFiltersSkeleton() {
  return (
    <SidebarContent className="space-y-4">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-9 w-full" />
      </div>
    </SidebarContent>
  );
}
