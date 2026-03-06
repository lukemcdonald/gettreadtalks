import { FeaturedGrid } from '@/components/featured-grid';
import { EditorialProfileLayout } from '@/components/layouts';
import { EditorialProfileHeroSkeleton, MediaCardSkeleton } from '@/components/skeletons';
import { Skeleton } from '@/components/ui';

function TalkHeroMetadataSkeleton() {
  return (
    <div className="border-white/10 border-t pt-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-4">
          <Skeleton className="h-3 w-16" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-3 w-14" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function TalkContentSkeleton() {
  return (
    <FeaturedGrid columns={{ default: 1, sm: 2, md: 2, lg: 2 }} title="More Talks">
      {Array.from({ length: 4 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items never reorder
        <MediaCardSkeleton key={i} />
      ))}
    </FeaturedGrid>
  );
}

export default function TalkLoading() {
  return (
    <EditorialProfileLayout
      content={<TalkContentSkeleton />}
      hero={
        <EditorialProfileHeroSkeleton>
          <TalkHeroMetadataSkeleton />
        </EditorialProfileHeroSkeleton>
      }
    />
  );
}
