import { VideoFrameSkeleton } from '@/components/media-embed';
import { Container, Section, Skeleton } from '@/components/ui';

export function EditorialProfileHeroSkeleton() {
  return (
    <Section className="bg-background relative overflow-hidden py-6 sm:py-8 md:py-12 lg:py-16">
      <Container className="relative space-y-8">
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-8 w-2/3 sm:h-9 lg:h-10" />
          <Skeleton className="mx-auto h-6 w-40" />
        </div>
        <div className="mx-auto w-full max-w-4xl">
          <VideoFrameSkeleton />
        </div>
      </Container>
    </Section>
  );
}
