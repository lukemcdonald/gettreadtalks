import { GridList } from '@/components/grid-list';
import { MediaCardSkeleton } from '@/components/skeletons';

interface TalksListSkeletonProps {
  count?: number;
}

export function TalksListSkeleton({ count = 6 }: TalksListSkeletonProps) {
  return (
    <GridList columns={{ default: 1, lg: 2, md: 2, sm: 1, xl: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        // oxlint-disable-next-line react/no-array-index-key -- static skeleton items never reorder
        <MediaCardSkeleton key={i} />
      ))}
    </GridList>
  );
}
