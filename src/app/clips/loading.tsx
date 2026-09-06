import { PageHeader } from '@/components/page-header';
import { Container, Section } from '@/components/ui';
import { ClipsListSkeleton } from '@/features/clips/components/clips-list-skeleton';

export default function ClipsLoading() {
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
        <ClipsListSkeleton />
      </Container>
    </Section>
  );
}
