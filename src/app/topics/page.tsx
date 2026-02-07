import { TopicsBrowseContent } from '@/app/topics/_components/topics-browse-content';
import { TopicsControls } from '@/app/topics/_components/topics-controls';
import { PageHeader } from '@/components/page-header';
import { Container, Section } from '@/components/ui';
import { getTopicsWithTalks } from '@/features/topics/queries/get-topics-with-talks';

export default async function TopicsPage() {
  const topicsWithTalks = await getTopicsWithTalks();

  return (
    <Section>
      <Container>
        <div className="space-y-8">
          <div className="space-y-6">
            <PageHeader
              description="Explore talks organized by topic and theme."
              title="Topics"
              variant="lg"
            />
            <TopicsControls topics={topicsWithTalks.map((item) => item.topic)} />
          </div>

          <TopicsBrowseContent topics={topicsWithTalks} />
        </div>
      </Container>
    </Section>
  );
}
