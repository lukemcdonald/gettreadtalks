import { FeaturedGrid } from '@/components/featured-grid';
import { EditorialProfileLayout } from '@/components/layouts';
import { MediaCardSkeleton } from '@/components/skeletons';
import { Container, Section, Skeleton } from '@/components/ui';

function TalkHeroSkeleton() {
  return (
    <Section className="dark relative overflow-hidden" spacing="3xl">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-950" />

      <Container className="relative space-y-8">
        {/* Title + speaker attribution — centered */}
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-10 w-2/3 sm:h-12 lg:h-14" />
          <Skeleton className="mx-auto h-5 w-40" />
        </div>

        {/* Video player — full width */}
        <Skeleton className="aspect-video w-full rounded-2xl" />

        {/* Metadata — Actions / Topics / Scripture */}
        <div className="border-white/10 border-t pt-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Actions */}
            <div className="space-y-4">
              <Skeleton className="h-3 w-16" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
            {/* Topics */}
            <div className="space-y-4">
              <Skeleton className="h-3 w-14" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
            </div>
            {/* Scripture */}
            <div className="space-y-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-36 rounded-full" />
            </div>
          </div>
        </div>
      </Container>
    </Section>
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
  return <EditorialProfileLayout content={<TalkContentSkeleton />} hero={<TalkHeroSkeleton />} />;
}
