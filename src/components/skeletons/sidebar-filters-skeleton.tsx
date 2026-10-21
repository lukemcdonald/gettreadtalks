import { SidebarContent } from '@/components/sidebar-content';
import { Skeleton } from '@/components/ui';

function DesktopFilterFieldSkeleton({
  labelClassName,
}: {
  labelClassName: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className={labelClassName} />
      <Skeleton className="h-9.5 w-full" />
    </div>
  );
}

export function SidebarFiltersSkeleton() {
  return (
    <SidebarContent className="space-y-4">
      <div className="flex items-center gap-2 md:hidden">
        <Skeleton className="h-9.5 flex-1" />
        <Skeleton className="size-10 shrink-0" />
      </div>
      <div className="hidden md:flex md:flex-col md:gap-4">
        <DesktopFilterFieldSkeleton labelClassName="h-4 w-12" />
        <DesktopFilterFieldSkeleton labelClassName="h-4 w-16" />
        <DesktopFilterFieldSkeleton labelClassName="h-4 w-12" />
        <DesktopFilterFieldSkeleton labelClassName="h-4 w-14" />
      </div>
    </SidebarContent>
  );
}
