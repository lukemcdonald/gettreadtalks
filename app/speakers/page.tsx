import { SpeakerCard } from '@/components/cards';
import { AlphabeticalGrid } from '@/components/grid';
import { ListPageLayout, SectionContainer } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getAllSpeakersGrouped } from '@/lib/features/speakers';

export default async function SpeakersPage() {
  const groups = await getAllSpeakersGrouped();

  return (
    <ListPageLayout>
      <SectionContainer>
        <PageHeader
          description="Listen to faithful ambassadors of Christ and be blessed."
          title="All Speakers"
        />

        <AlphabeticalGrid
          groups={groups.map((group) => ({
            items: group.items.map((speaker) => (
              <SpeakerCard
                featured={speaker.featured}
                key={speaker._id}
                speaker={{
                  _id: speaker._id,
                  featured: speaker.featured,
                  firstName: speaker.firstName,
                  imageUrl: speaker.imageUrl,
                  lastName: speaker.lastName,
                  role: speaker.role,
                  slug: speaker.slug,
                }}
              />
            )),
            letter: group.letter,
            range: group.range,
          }))}
        />
      </SectionContainer>
    </ListPageLayout>
  );
}
