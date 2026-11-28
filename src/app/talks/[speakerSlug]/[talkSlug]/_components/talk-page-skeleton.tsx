import { FeaturedGrid } from '@/components/featured-grid';
import { EditorialProfileLayout } from '@/components/layouts';
import {
  EditorialProfileHeroSkeleton,
  MediaCardSkeleton,
  SectionCopySkeleton,
} from '@/components/skeletons';
import { Skeleton } from '@/components/ui';

function TalkActionsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="size-9 rounded-full" />
    </div>
  );
}

export function TalkRelatedTalksSkeleton() {
  return (
    <FeaturedGrid
      columns={{ default: 1, lg: 2, md: 2, sm: 1, xl: 2 }}
      description={<SectionCopySkeleton />}
      title="More Talks"
    >
      {Array.from({ length: 2 }).map((_, i) => (
        // oxlint-disable-next-line react/no-array-index-key -- static skeleton items never reorder
        <MediaCardSkeleton key={i} />
      ))}
    </FeaturedGrid>
  );
}

function TalkContentSkeleton() {
  return (
    <div className="space-y-12 lg:space-y-16">
      <TalkActionsSkeleton />
      <TalkRelatedTalksSkeleton />
    </div>
  );
}

export function TalkPageSkeleton() {
  return (
    <EditorialProfileLayout
      content={<TalkContentSkeleton />}
      hero={<EditorialProfileHeroSkeleton />}
    />
  );
}
