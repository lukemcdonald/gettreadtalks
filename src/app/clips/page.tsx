import type { ClipsSearchParams } from '@/app/clips/_components/clips-results';
import type { Metadata } from 'next';

import { Suspense } from 'react';

import { ClipsResults } from '@/app/clips/_components/clips-results';
import { PageHeader } from '@/components/page-header';
import { Container, Section } from '@/components/ui';
import { ClipsListSkeleton } from '@/features/clips/components/clips-list-skeleton';
import { buildClipsPath } from '@/features/clips/utils';
import { buildPageMetadata } from '@/lib/metadata';

// fallow-ignore-next-line unused-export
export const ensureStatic = 'shell';

export const metadata: Metadata = buildPageMetadata({
  canonical: buildClipsPath(),
  description:
    'Short Christ centered clips from TREAD Talks. Get quick encouragement from the best sermons and talks you can listen to and share.',
  title: 'Clips',
});

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
