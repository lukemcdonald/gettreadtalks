import { Skeleton } from '@/components/ui';

export function SectionCopySkeleton() {
  return (
    <div className="space-y-1">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
