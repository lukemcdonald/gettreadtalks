import { GridList } from '@/components/grid-list';
import { MediaCardSkeleton } from '@/components/media-card-skeleton';

export function TalksListSkeleton() {
  return (
    <GridList columns={{ default: 1, md: 2 }}>
      {Array.from({ length: 6 }).map((_, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: range
        <MediaCardSkeleton key={idx} />
      ))}
    </GridList>
  );
}
