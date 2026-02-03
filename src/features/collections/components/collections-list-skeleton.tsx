import { GridList } from '@/components/grid-list';
import { CollectionCardSkeleton } from './collection-card-skeleton';

interface CollectionsListSkeletonProps {
  count?: number;
}

export function CollectionsListSkeleton({ count = 6 }: CollectionsListSkeletonProps) {
  return (
    <GridList>
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items never reorder
        <CollectionCardSkeleton key={i} />
      ))}
    </GridList>
  );
}
