import { FeaturedVideoCardSkeleton } from '@/components/featured-video-card';
import { Container, Section, Skeleton } from '@/components/ui';

export function SpeakerHeroSkeleton() {
  return (
    <Section className="relative overflow-hidden" spacing="3xl">
      <Container className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-12">
        <div className="lg:flex-1">
          <header className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
            <Skeleton className="size-20 shrink-0 rounded-full md:size-24" />
            <div className="flex w-full min-w-0 flex-1 flex-col items-center gap-4 text-center md:items-start md:text-left">
              <div className="max-w-full space-y-2">
                <Skeleton className="mx-auto h-9 w-56 sm:h-10 md:mx-0 lg:h-12" />
                <Skeleton className="mx-auto h-4 w-24 md:mx-0" />
              </div>
            </div>
          </header>
        </div>
        <div className="lg:flex-1">
          <FeaturedVideoCardSkeleton />
        </div>
      </Container>
    </Section>
  );
}
