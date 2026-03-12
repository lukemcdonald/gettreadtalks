import { FeaturedGrid } from '@/components/featured-grid';
import { EditorialProfileLayout } from '@/components/layouts';
import { EditorialProfileHeroSkeleton, MediaCardSkeleton } from '@/components/skeletons';

function ClipContentSkeleton() {
  return (
    <div className="space-y-8 md:space-y-12 lg:space-y-16">
      <FeaturedGrid columns={{ default: 1 }} title="From the Talk">
        <MediaCardSkeleton />
      </FeaturedGrid>
      <FeaturedGrid columns={{ default: 1 }} title="Speaker">
        <MediaCardSkeleton />
      </FeaturedGrid>
    </div>
  );
}

export default function ClipLoading() {
  return (
    <EditorialProfileLayout
      content={<ClipContentSkeleton />}
      hero={<EditorialProfileHeroSkeleton />}
    />
  );
}
