'use client';

import { Card, Skeleton } from '@/components/ui';

export function MediaCardSkeleton() {
  return (
    <Card className="relative flex-row items-center gap-4 p-4">
      <Skeleton className="size-12 rounded bg-muted" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-5 w-3/4 rounded bg-muted" />
        <Skeleton className="h-4 w-1/4 rounded bg-muted" />
      </div>
    </Card>
  );
}
