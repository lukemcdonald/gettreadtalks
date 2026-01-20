import { ClipsContent } from '@/app/clips/_components/clips-content';
import { ClipsSidebar } from '@/app/clips/_components/clips-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getClips } from '@/features/clips';
import { getSpeakers, sortSpeakersByName } from '@/features/speakers';
import { getTopicsWithCounts } from '@/features/topics';

export interface ClipsPageSearchParams {
  cursor?: string;
  search?: string;
  sort?: string;
  speakers?: string;
  topicSlug?: string;
}

interface ClipsPageProps {
  searchParams: Promise<ClipsPageSearchParams>;
}

export default async function ClipsPage({ searchParams }: ClipsPageProps) {
  const params = await searchParams;
  const { cursor, search, sort, speakers, topicSlug } = params;

  // Parse comma-separated speakers into array
  const speakerSlugs = speakers ? speakers.split(',').filter(Boolean) : undefined;

  // Check if any filters are active (for showing "clear filters" option)
  const hasActiveFilters = !!(search || speakerSlugs?.length || topicSlug);

  const [result, speakersResult, topics] = await Promise.all([
    getClips({
      cursor,
      search,
      sort,
      speakerSlugs,
      topicSlug,
    }),
    getSpeakers(), // Fetch ALL speakers with published content (independent of filters)
    getTopicsWithCounts(),
  ]);

  const sortedSpeakers = sortSpeakersByName(speakersResult.speakers);

  return (
    <SidebarLayout
      content={
        <ClipsContent
          clips={result.clips}
          continueCursor={result.continueCursor}
          hasActiveFilters={hasActiveFilters}
          hasNextPage={!result.isDone}
          hasPrevPage={!!cursor}
        />
      }
      header={
        <PageHeader
          description="Be encouraged by these short Christ centered clips."
          title="Clips"
          variant="lg"
        />
      }
      sidebar={<ClipsSidebar speakers={sortedSpeakers} topics={topics} />}
      sidebarSticky
    />
  );
}
