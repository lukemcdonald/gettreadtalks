import { GridList } from '@/components/grid-list';
import { MediaCardSkeleton } from '@/components/skeletons';

interface TalksListSkeletonProps {
  count?: number;
}

export function TalksListSkeleton({ count = 6 }: TalksListSkeletonProps) {
  return (
    <GridList columns={{ default: 1, sm: 1, md: 2, lg: 2, xl: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items never reorder
        <MediaCardSkeleton key={i} />
      ))}
    </GridList>
  );
}
