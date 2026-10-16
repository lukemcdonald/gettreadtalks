import { CollectionsContent } from '@/app/collections/_components/collections-content';
import { loadCollections } from '@/features/collections/queries/load-collections';

export interface CollectionsSearchParams {
  sort?: string;
  speaker?: string;
}

interface CollectionsResultsProps {
  searchParams: Promise<CollectionsSearchParams>;
}

export async function CollectionsResults({
  searchParams,
}: CollectionsResultsProps) {
  const { sort, speaker: speakerSlug } = await searchParams;
  const { collections } = await loadCollections({ sort, speakerSlug });

  return (
    <CollectionsContent
      collections={collections}
      hasActiveFilters={!!speakerSlug}
    />
  );
}
