import { Container, Section, Skeleton } from '@/components/ui';

export function SpeakerHeroSkeleton() {
  return (
    <Section className="relative overflow-hidden" spacing="3xl">
      <Container className="relative">
        <div className="mx-auto w-full max-w-2xl text-center">
          <Skeleton className="mx-auto h-12 w-56 sm:h-14 lg:h-16" />
        </div>
      </Container>
    </Section>
  );
}
