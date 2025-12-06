import { CollectionsContent } from '@/app/collections/_components/collections-content';
import { CollectionsSidebar } from '@/app/collections/_components/collections-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { getCollectionsWithStats } from '@/features/collections';
import { getSpeakers, sortSpeakersByName } from '@/features/speakers';

export default async function CollectionsPage() {
  const { collections } = await getCollectionsWithStats();

  // Get unique speakers who have collections
  const allSpeakers = collections.flatMap((item) => item.speakers);
  const speakersWithCollections = Array.from(
    new Map(allSpeakers.map((speaker) => [speaker.slug, speaker])).values(),
  );
  const speakers = sortSpeakersByName(speakersWithCollections);

  return (
    <SidebarLayout
      content={<CollectionsContent collections={collections} />}
      sidebar={<CollectionsSidebar speakers={speakers} />}
      sidebarSticky
    />
  );
}
