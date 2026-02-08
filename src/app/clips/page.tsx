import { ClipsContent } from '@/app/clips/_components/clips-content';
import { PageHeader } from '@/components/page-header';
import { Container, Section } from '@/components/ui';
import { getClips } from '@/features/clips/queries/get-clips';

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
    <>
      <Section>
        <Container>
          <PageHeader
            description="Be encouraged by these short Christ centered clips."
            title="Clips"
            variant="lg"
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <ClipsContent
            clips={result.clips}
            continueCursor={result.continueCursor}
            hasNextPage={!result.isDone}
            hasPrevPage={!!cursor}
          />
        </Container>
      </Section>
    </>
  );
}
