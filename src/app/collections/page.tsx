import type { CollectionSortOption } from '@/convex/lib/sort';

import { CollectionsContent } from '@/app/collections/_components/collections-content';
import { CollectionsSidebar } from '@/app/collections/_components/collections-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { getCollectionComparator } from '@/convex/lib/sort';
import { getCollections } from '@/features/collections/queries/get-collections';
import { sortSpeakersByName } from '@/features/speakers/utils';

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

  const { collections: allCollections } = await getCollections();

  const { search, sort, speakerSlug } = params;
  const hasActiveFilters = Boolean(search || speakerSlug);

  let filtered = allCollections;

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      ({ collection }) =>
        collection.title.toLowerCase().includes(searchLower) ||
        collection.description?.toLowerCase().includes(searchLower),
    );
  }

  if (speakerSlug) {
    filtered = filtered.filter((item) => item.speakers.some((s) => s.slug === speakerSlug));
  }

  const collections = [...filtered].sort(getCollectionComparator(sort as CollectionSortOption));

  // Get unique speakers who have collections (for sidebar)
  const allSpeakers = allCollections.flatMap((item) => item.speakers);
  const speakersWithCollections = Array.from(
    new Map(allSpeakers.map((speaker) => [speaker.slug, speaker])).values(),
  );
  const speakers = sortSpeakersByName(speakersWithCollections);

  return (
    <SidebarLayout
      content={<CollectionsContent collections={collections} hasActiveFilters={hasActiveFilters} />}
      sidebar={<CollectionsSidebar speakers={speakers} />}
      sidebarSticky
    />
  );
}
