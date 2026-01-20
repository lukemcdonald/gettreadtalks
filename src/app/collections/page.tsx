import { CollectionsList } from '@/app/collections/_components/collections-list';
import { CollectionsSidebar } from '@/app/collections/_components/collections-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { getCollections } from '@/features/collections';
import { sortSpeakersByName } from '@/features/speakers';

export interface CollectionsPageSearchParams {
  search?: string;
  sort?: string;
  speakerSlug?: string;
}

interface CollectionsPageProps {
  searchParams: Promise<CollectionsPageSearchParams>;
}

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const params = await searchParams;
  const { search, sort = 'alphabetical', speakerSlug } = params;

  const hasActiveFilters = !!(search || (speakerSlug && speakerSlug !== 'all'));

  const { collections: allCollections } = await getCollections();

  // Filter collections server-side
  let filtered = allCollections;

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      ({ collection }) =>
        collection.title.toLowerCase().includes(searchLower) ||
        collection.description?.toLowerCase().includes(searchLower),
    );
  }

  if (speakerSlug && speakerSlug !== 'all') {
    filtered = filtered.filter((item) => item.speakers.some((s) => s.slug === speakerSlug));
  }

  // Sort collections server-side
  const collections = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'most-talks':
        return b.talkCount - a.talkCount;
      case 'least-talks':
        return a.talkCount - b.talkCount;
      default:
        return a.collection.title.localeCompare(b.collection.title);
    }
  });

  // Get unique speakers who have collections (for sidebar)
  const allSpeakers = allCollections.flatMap((item) => item.speakers);
  const speakersWithCollections = Array.from(
    new Map(allSpeakers.map((speaker) => [speaker.slug, speaker])).values(),
  );
  const speakers = sortSpeakersByName(speakersWithCollections);

  return (
    <SidebarLayout
      content={<CollectionsList collections={collections} hasActiveFilters={hasActiveFilters} />}
      sidebar={<CollectionsSidebar speakers={speakers} />}
      sidebarSticky
    />
  );
}
