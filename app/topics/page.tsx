import { ListPageLayout, SectionContainer } from '@/components/layouts';
import { TopicCard } from '@/components/cards';
import { GridList } from '@/components/grid';
import { PageHeader } from '@/components/page-header';
import { getTopicsWithCounts } from '@/lib/features/topics';

export default async function TopicsPage() {
  const topics = await getTopicsWithCounts();

  return (
    <ListPageLayout>
      <SectionContainer>
        <PageHeader
          description="Explore talks organized by topic and theme."
          title="Topics"
        />

        <GridList>
          {topics.map((item) => (
            <TopicCard key={item.topic._id} talkCount={item.count} topic={item.topic} />
          ))}
        </GridList>
      </SectionContainer>
    </ListPageLayout>
  );
}
