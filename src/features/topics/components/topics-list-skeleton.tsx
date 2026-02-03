import { GridList } from '@/components/grid-list';
import { TopicCardSkeleton } from './topic-card-skeleton';

interface TopicsListSkeletonProps {
  count?: number;
}

export function TopicsListSkeleton({ count = 9 }: TopicsListSkeletonProps) {
  return (
    <GridList>
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items never reorder
        <TopicCardSkeleton key={i} />
      ))}
    </GridList>
  );
}
