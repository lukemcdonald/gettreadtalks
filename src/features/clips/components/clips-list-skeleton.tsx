import { GridList } from '@/components/grid-list';
import { MediaCardSkeleton } from '@/components/skeletons';

interface ClipsListSkeletonProps {
  count?: number;
}

export function ClipsListSkeleton({ count = 6 }: ClipsListSkeletonProps) {
  return (
    <GridList columns={{ default: 1, lg: 2, md: 2, sm: 1, xl: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        // oxlint-disable-next-line react/no-array-index-key -- static skeleton items never reorder
        <MediaCardSkeleton key={i} />
      ))}
    </GridList>
  );
}
