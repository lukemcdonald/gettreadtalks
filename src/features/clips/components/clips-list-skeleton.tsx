import { FeaturedVideoCardSkeleton } from '@/components/featured-video-card';
import { MediaCardSkeleton } from '@/components/skeletons';

interface ClipsListSkeletonProps {
  count?: number;
}

export function ClipsListSkeleton({ count = 6 }: ClipsListSkeletonProps) {
  return (
    <div className="grid auto-rows-min grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="md:col-span-2 lg:row-span-4 lg:mb-2 xl:row-span-5">
        <FeaturedVideoCardSkeleton />
      </div>

      {Array.from({ length: count }).map((_, i) => (
        // oxlint-disable-next-line react/no-array-index-key -- static skeleton items never reorder
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  );
}
