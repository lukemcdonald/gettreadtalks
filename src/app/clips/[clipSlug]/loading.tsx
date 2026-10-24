import { FeaturedGrid } from '@/components/featured-grid';
import { EditorialProfileLayout } from '@/components/layouts';
import {
  EditorialProfileHeroSkeleton,
  MediaCardSkeleton,
} from '@/components/skeletons';

function ClipContentSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-[1fr_280px]">
      <div className="order-2 space-y-16 lg:order-1">
        <FeaturedGrid columns={{ default: 1 }} title="From the Talk">
          <MediaCardSkeleton />
        </FeaturedGrid>
        <FeaturedGrid columns={{ default: 1 }} title="Speaker">
          <MediaCardSkeleton />
        </FeaturedGrid>
      </div>
      <aside className="order-1 lg:sticky lg:top-20 lg:order-2 lg:h-fit" />
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
