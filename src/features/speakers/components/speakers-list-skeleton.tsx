import { GridList } from '@/components/grid-list';
import { MediaCardSkeleton } from '@/components/skeletons';
import { Skeleton } from '@/components/ui';

interface SpeakersListSkeletonProps {
  groupCount?: number;
  itemsPerGroup?: number;
}

export function SpeakersListSkeleton({
  groupCount = 3,
  itemsPerGroup = 6,
}: SpeakersListSkeletonProps) {
  return (
    <div className="space-y-12">
      {Array.from({ length: groupCount }).map((_, groupIndex) => (
        // oxlint-disable-next-line react/no-array-index-key -- static skeleton groups never reorder
        <section className="space-y-6" key={groupIndex}>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-4 w-24" />
          </div>
          <GridList columns={{ default: 1, lg: 3, md: 3, sm: 2, xl: 3 }}>
            {Array.from({ length: itemsPerGroup }).map((_item, itemIndex) => (
              // oxlint-disable-next-line react/no-array-index-key -- static skeleton items never reorder
              <MediaCardSkeleton key={itemIndex} />
            ))}
          </GridList>
        </section>
      ))}
    </div>
  );
}
