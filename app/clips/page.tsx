import { ClipCard } from '@/components/cards';
import { GridList } from '@/components/grid';
import { ListPageLayout, SectionContainer } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getClips } from '@/lib/features/clips';

export default async function ClipsPage() {
  const result = await getClips(12);

  return (
    <ListPageLayout>
      <SectionContainer>
        <PageHeader
          description="Be encouraged by these short Christ centered clips."
          title="Clips"
        />

        <GridList columns={{ default: 1, sm: 2, md: 3, lg: 4 }}>
          {result.clips.map((clip) => (
            <ClipCard
              clip={{
                _id: clip._id,
                description: clip.description,
                slug: clip.slug,
                title: clip.title,
              }}
              key={clip._id}
              speaker={
                clip.speaker
                  ? {
                      firstName: clip.speaker.firstName,
                      imageUrl: clip.speaker.imageUrl,
                      lastName: clip.speaker.lastName,
                      slug: clip.speaker.slug,
                    }
                  : undefined
              }
            />
          ))}
        </GridList>
      </SectionContainer>
    </ListPageLayout>
  );
}
