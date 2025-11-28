import { CollectionsContent } from '@/app/collections/_components/collections-content';
import { CollectionsSidebar } from '@/app/collections/_components/collections-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { getAllCollectionsWithStats } from '@/features/collections';
import { getAllSpeakers, sortSpeakersByName } from '@/features/speakers';

export default async function CollectionsPage() {
  const [result, _speakers] = await Promise.all([getAllCollectionsWithStats(), getAllSpeakers()]);

  // Get unique speakers who have collections
  const allSpeakers = result.page.flatMap((item) => item.speakers);
  const speakersWithCollections = Array.from(
    new Map(allSpeakers.map((speaker) => [speaker.slug, speaker])).values(),
  );
  const sortedSpeakersWithCollections = sortSpeakersByName(speakersWithCollections);

  return (
    <SidebarLayout
      content={<CollectionsContent collections={result.page} />}
      sidebar={<CollectionsSidebar speakersWithCollections={sortedSpeakersWithCollections} />}
      sidebarSticky
    />
  );
}
