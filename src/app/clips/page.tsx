import type { Metadata } from 'next';

import { ClipsContent } from '@/app/clips/_components/clips-content';
import { PageHeader } from '@/components/page-header';
import { Container, Section } from '@/components/ui';
import { getClips } from '@/features/clips/queries/get-clips';

export const metadata: Metadata = {
  description: 'Short Christ centered clips — quick encouragement from the best talks.',
  title: 'Clips',
};

export interface ClipsPageSearchParams {
  cursor?: string;
}

interface ClipsPageProps {
  searchParams: Promise<ClipsPageSearchParams>;
}

export default async function ClipsPage({ searchParams }: ClipsPageProps) {
  const params = await searchParams;
  const { cursor } = params;

  const result = await getClips({ cursor });

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

        <ClipsContent
          clips={result.clips}
          continueCursor={result.continueCursor}
          hasNextPage={!result.isDone}
          hasPrevPage={!!cursor}
        />
      </Container>
    </Section>
  );
}
