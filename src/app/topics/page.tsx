import type { Metadata } from 'next';

import { InlineTopicFilter } from '@/app/topics/_components/inline-topic-filter';
import { TopicsBrowseContent } from '@/app/topics/_components/topics-browse-content';
import { PageHeader } from '@/components/page-header';
import { Container, Section } from '@/components/ui';
import { getTopicsWithTalks } from '@/features/topics/queries/get-topics-with-talks';

export const metadata: Metadata = {
  description: 'Browse talks by Bible topic or theme and deepen your understanding of Scripture.',
  title: 'Topics',
};

export default async function TopicsPage() {
  const topicsWithTalks = await getTopicsWithTalks();

  return (
    <Section spacing="xl">
      <Container>
        <div className="space-y-8">
          <PageHeader
            description={
              <>
                Explore <InlineTopicFilter topics={topicsWithTalks.map((item) => item.topic)} />{' '}
                organized by theme.
              </>
            }
            title="Topics"
            variant="lg"
          />

          <TopicsBrowseContent topics={topicsWithTalks} />
        </div>
      </Container>
    </Section>
  );
}
