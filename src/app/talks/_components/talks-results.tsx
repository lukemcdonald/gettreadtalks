import { TalksContent } from '@/app/talks/_components/talks-content';
import { PUBLIC_LISTING_PAGE_SIZE } from '@/constants/ui';
import { loadTalks } from '@/features/talks/queries/load-talks';

export interface TalksSearchParams {
  cursor?: string;
  featured?: string;
  search?: string;
  sort?: string;
  speakers?: string;
  topics?: string;
}

interface TalksResultsProps {
  searchParams: Promise<TalksSearchParams>;
}

function splitSlugs(value?: string) {
  return value ? value.split(',').filter(Boolean) : undefined;
}

// fallow-ignore-next-line complexity
export async function TalksResults({ searchParams }: TalksResultsProps) {
  const params = await searchParams;
  const speakerSlugs = splitSlugs(params.speakers);
  const topicSlugs = splitSlugs(params.topics);
  const result = await loadTalks({
    cursor: params.cursor,
    featured: params.featured === 'true',
    limit: PUBLIC_LISTING_PAGE_SIZE,
    search: params.search,
    sort: params.sort,
    speakerSlugs,
    topicSlugs,
  });

  return (
    <TalksContent
      continueCursor={result.continueCursor}
      hasActiveFilters={Boolean(
        params.search ||
        speakerSlugs?.length ||
        topicSlugs?.length ||
        params.featured === 'true'
      )}
      hasNextPage={!result.isDone}
      hasPrevPage={!!params.cursor}
      talks={result.talks}
    />
  );
}
