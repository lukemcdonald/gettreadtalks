import { FeaturedGrid } from '@/components/featured-grid';
import { EditorialProfileLayout } from '@/components/layouts';
import { MediaCardSkeleton } from '@/components/skeletons';
import { Container, Section, Skeleton } from '@/components/ui';

function TalkHeroSkeleton() {
  return (
    <Section className="bg-background relative overflow-hidden py-6 sm:py-8 md:py-12 lg:py-16">
      <Container className="relative space-y-8">
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-8 w-2/3 sm:h-9 lg:h-10" />
          <Skeleton className="mx-auto h-6 w-40" />
        </div>
        <div className="mx-auto w-full max-w-4xl">
          <Skeleton className="aspect-video w-full rounded-2xl" />
        </div>
      </Container>
    </Section>
  );
}

function TalkMetadataSidebarSkeleton() {
  return (
    <div className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:gap-12 lg:flex-col lg:gap-8">
      <div className="space-y-4 sm:basis-full lg:basis-auto">
        <Skeleton className="h-3 w-16" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
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
        <Skeleton className="h-3 w-16" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function TalkContentSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-[1fr_280px]">
      <div className="order-2 space-y-8 lg:order-1 lg:space-y-16">
        <FeaturedGrid columns={{ default: 1 }} title="More Talks">
          {Array.from({ length: 3 }).map((_, i) => (
            // oxlint-disable-next-line react/no-array-index-key -- static skeleton items never reorder
            <MediaCardSkeleton key={i} />
          ))}
        </FeaturedGrid>
      </div>
      <aside className="order-1 lg:sticky lg:top-20 lg:order-2 lg:h-fit">
        <TalkMetadataSidebarSkeleton />
      </aside>
    </div>
  );
}

export function TalkPageSkeleton() {
  return (
    <EditorialProfileLayout
      content={<TalkContentSkeleton />}
      hero={<TalkHeroSkeleton />}
    />
  );
}
