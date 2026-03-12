import type { ReactNode } from 'react';

import { Container, Section, Skeleton } from '@/components/ui';

interface EditorialProfileHeroSkeletonProps {
  children?: ReactNode;
}

export function EditorialProfileHeroSkeleton({ children }: EditorialProfileHeroSkeletonProps) {
  return (
    <Section className="relative overflow-hidden" spacing="3xl">
      <Container className="relative space-y-8">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-10 w-2/3 sm:h-12 lg:h-14" />
          <Skeleton className="mx-auto h-5 w-40" />
        </div>

        <Skeleton className="aspect-video w-full rounded-2xl" />

        {children}
      </Container>
    </Section>
  );
}
