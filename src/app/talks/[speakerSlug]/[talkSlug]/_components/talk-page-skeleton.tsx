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
      columns={{ default: 1 }}
      description={<SectionCopySkeleton />}
      title="More Talks"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        // oxlint-disable-next-line react/no-array-index-key -- static skeleton items never reorder
        <MediaCardSkeleton key={i} />
      ))}
    </FeaturedGrid>
  );
}

function TalkContentSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-[1fr_280px]">
      <div className="order-2 space-y-8 lg:order-1 lg:space-y-16">
        <TalkRelatedTalksSkeleton />
      </div>
      <aside className="order-1 lg:sticky lg:top-20 lg:order-2 lg:h-fit">
        <TalkActionsSkeleton />
      </aside>
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
