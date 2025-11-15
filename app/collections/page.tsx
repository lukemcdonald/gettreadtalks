import { CollectionCard } from '@/components/cards';
import { GridList } from '@/components/grid';
import { ListPageLayout, SectionContainer } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getCollectionsWithStats } from '@/lib/features/collections';

export default async function CollectionsPage() {
  const result = await getCollectionsWithStats(12);

  return (
    <ListPageLayout>
      <SectionContainer>
        <PageHeader
          description="Each series includes talks given by one or more speakers on the same topic or book of the Bible."
          title="Series"
        />

        <GridList>
          {result.page.map((item) => (
            <CollectionCard
              collection={{
                _id: item.collection._id,
                description: item.collection.description,
                slug: item.collection.slug,
                title: item.collection.title,
              }}
              key={item.collection._id}
              speakers={item.speakers.map((speaker) => ({
                firstName: speaker.firstName,
                imageUrl: speaker.imageUrl,
                lastName: speaker.lastName,
                slug: speaker.slug,
              }))}
              talkCount={item.talkCount}
            />
          ))}
        </GridList>
      </SectionContainer>
    </ListPageLayout>
  );
}
