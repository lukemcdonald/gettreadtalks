import { SpeakerHeroSkeleton } from '@/app/speakers/[speakerSlug]/_components/speaker-hero-skeleton';
import { FeaturedGrid } from '@/components/featured-grid';
import { EditorialProfileLayout } from '@/components/layouts';
import { MediaCardSkeleton } from '@/components/skeletons';

function SpeakerContentSkeleton() {
  return (
    <>
      <FeaturedGrid columns={{ default: 1, sm: 2, md: 2, lg: 2 }} title="Talks">
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items never reorder
          <MediaCardSkeleton key={i} />
        ))}
      </FeaturedGrid>

      <FeaturedGrid columns={{ default: 1, sm: 2, md: 2, lg: 2 }} title="Collections">
        {Array.from({ length: 2 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items never reorder
          <MediaCardSkeleton key={i} />
        ))}
      </FeaturedGrid>
    </>
  );
}

export default function SpeakerLoading() {
  return (
    <EditorialProfileLayout content={<SpeakerContentSkeleton />} hero={<SpeakerHeroSkeleton />} />
  );
}
