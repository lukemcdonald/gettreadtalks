import { Card, Skeleton } from '@/components/ui';
import { cn } from '@/utils';

interface MediaCardSkeletonProps {
  className?: string;
}

export function MediaCardSkeleton({ className }: MediaCardSkeletonProps) {
  return (
    <Card className={cn('flex-row gap-4 border-0 p-4', className)}>
      <Skeleton className="size-12 shrink-0 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </Card>
  );
}
