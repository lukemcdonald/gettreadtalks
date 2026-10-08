import { GridList } from '@/components/grid-list';
import { Skeleton } from '@/components/ui';

function TopicSectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-7 w-36 shrink-0" />
        <div className="bg-border h-px flex-1" />
        <Skeleton className="h-4 w-14 shrink-0" />
      </div>
      <GridList columns={{ default: 1, md: 2 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          // oxlint-disable-next-line react/no-array-index-key -- static skeleton items never reorder
          <Skeleton className="h-20 w-full" key={i} />
        ))}
      </GridList>
    </div>
  );
}

export function TopicsBrowseSkeleton() {
  return (
    <div className="space-y-16">
      {Array.from({ length: 3 }).map((_, i) => (
        // oxlint-disable-next-line react/no-array-index-key -- static skeleton items never reorder
        <TopicSectionSkeleton key={i} />
      ))}
    </div>
  );
}
