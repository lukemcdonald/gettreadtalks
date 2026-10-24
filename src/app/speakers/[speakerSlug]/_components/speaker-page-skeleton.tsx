import { SpeakerHeroSkeleton } from '@/app/speakers/[speakerSlug]/_components/speaker-hero-skeleton';
import { FeaturedGrid } from '@/components/featured-grid';
import { EditorialProfileLayout } from '@/components/layouts';
import { MediaCardSkeleton } from '@/components/skeletons';
import { Skeleton } from '@/components/ui';

function SpeakerActionsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="size-9 rounded-full" />
    </div>
  );
}

export function SpeakerContentSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-[1fr_280px]">
      <div className="order-2 space-y-16 lg:order-1">
        <FeaturedGrid columns={{ default: 1 }} title="Talks">
          {Array.from({ length: 4 }).map((_, i) => (
            // oxlint-disable-next-line react/no-array-index-key -- static skeleton items never reorder
            <MediaCardSkeleton key={i} />
          ))}
        </FeaturedGrid>
      </div>
      <aside className="order-1 lg:sticky lg:top-20 lg:order-2 lg:h-fit">
        <SpeakerActionsSkeleton />
      </aside>
    </div>
  );
}

export function SpeakerPageSkeleton() {
  return (
    <EditorialProfileLayout
      content={<SpeakerContentSkeleton />}
      hero={<SpeakerHeroSkeleton />}
    />
  );
}
