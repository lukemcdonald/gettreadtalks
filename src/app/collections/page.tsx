import type { CollectionSortOption } from '@/convex/lib/sort';

import { CollectionsContent } from '@/app/collections/_components/collections-content';
import { CollectionsSidebar } from '@/app/collections/_components/collections-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getCollectionComparator } from '@/convex/lib/sort';
import { getCollections } from '@/features/collections/queries/get-collections';
import { sortSpeakersByName } from '@/features/speakers/utils';

export interface CollectionsPageSearchParams {
  sort?: string;
  speakerSlug?: string;
}

interface CollectionsPageProps {
  searchParams: Promise<CollectionsPageSearchParams>;
}

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const params = await searchParams;

  const { collections: allCollections } = await getCollections();

  const { sort, speakerSlug } = params;
  const hasActiveFilters = Boolean(speakerSlug);

  let filtered = allCollections;

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
      header={
        <PageHeader
          description="Each series includes talks given by one or more speakers on the same topic or book of the Bible."
          title="Collections"
          variant="lg"
        />
      }
      sidebar={<CollectionsSidebar speakers={speakers} />}
      sidebarSticky
    />
  );
}
