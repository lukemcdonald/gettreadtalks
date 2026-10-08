import type { ClipsSearchParams } from '@/app/clips/_components/clips-results';
import type { Metadata } from 'next';

import { Suspense } from 'react';

import { ClipsResults } from '@/app/clips/_components/clips-results';
import { PageHeader } from '@/components/page-header';
import { Container, Section } from '@/components/ui';
import { ClipsListSkeleton } from '@/features/clips/components/clips-list-skeleton';

export const metadata: Metadata = {
  description:
    'Short Christ centered clips — quick encouragement from the best talks.',
  title: 'Clips',
};

interface ClipsPageProps {
  searchParams: Promise<ClipsSearchParams>;
}

export default function ClipsPage({ searchParams }: ClipsPageProps) {
  return (
    <Section spacing="xl">
      <Container>
        <div className="mb-10">
          <PageHeader
            description="Be encouraged by these short Christ centered clips."
            size="lg"
            title="Clips"
          />
        </div>

        <Suspense fallback={<ClipsListSkeleton />}>
          <ClipsResults searchParams={searchParams} />
        </Suspense>
      </Container>
    </Section>
  );
}
