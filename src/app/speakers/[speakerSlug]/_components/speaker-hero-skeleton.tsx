import { Container, Section, Skeleton } from '@/components/ui';

export function SpeakerHeroSkeleton() {
  return (
    <Section className="relative overflow-hidden" spacing="3xl">
      <Container className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-12">
        {/* Speaker details — left column */}
        <div className="lg:flex-1">
          <header className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:gap-8 md:text-left">
            {/* Avatar */}
            <Skeleton className="size-20 shrink-0 rounded-full md:size-28" />

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                {/* Role badge */}
                <Skeleton className="mx-auto h-3 w-20 md:mx-0" />
                {/* Name */}
                <Skeleton className="mx-auto h-12 w-56 sm:h-14 md:mx-0 lg:h-16" />
                {/* Ministry link */}
                <Skeleton className="mx-auto h-4 w-32 md:mx-0" />
              </div>
              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="mx-auto h-4 w-full md:mx-0" />
                <Skeleton className="mx-auto h-4 w-4/5 md:mx-0" />
              </div>
            </div>
          </header>
        </div>

        {/* Featured video — right column */}
        <div className="lg:flex-1">
          <div className="flex flex-col gap-4">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-20 shrink-0" />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
