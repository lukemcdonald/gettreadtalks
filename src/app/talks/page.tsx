import { TalksContent } from '@/app/talks/_components/talks-content';
import { TalksSidebar } from '@/app/talks/_components/talks-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getSpeakers, sortSpeakersByName } from '@/features/speakers';
import { getTalks } from '@/features/talks/queries';
import { getTopicsWithCounts } from '@/features/topics';

export interface TalksPageSearchParams {
  cursor?: string;
  featured?: string;
  search?: string;
  sort?: string;
  speakers?: string;
  topicSlug?: string;
}

interface TalksPageProps {
  searchParams: Promise<TalksPageSearchParams>;
}

export default async function TalksPage({ searchParams }: TalksPageProps) {
  const params = await searchParams;
  const { cursor, featured, search, sort, speakers, topicSlug } = params;

  // Parse comma-separated speakers into array
  const speakerSlugs = speakers ? speakers.split(',').filter(Boolean) : undefined;

  // Check if any filters are active (for showing "clear filters" option)
  const hasActiveFilters = !!(search || speakerSlugs?.length || topicSlug || featured === 'true');

  const [result, speakersResult, topics] = await Promise.all([
    getTalks({
      cursor,
      featured: featured === 'true',
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
        <TalksContent
          continueCursor={result.continueCursor}
          hasActiveFilters={hasActiveFilters}
          hasNextPage={!result.isDone}
          hasPrevPage={!!cursor}
          talks={result.talks}
        />
      }
      header={
        <PageHeader
          description="Elevate your spiritual heartbeat with Christ centered talks."
          title="Talks"
          variant="lg"
        />
      }
      sidebar={<TalksSidebar speakers={sortedSpeakers} topics={topics} />}
      sidebarSticky
    />
  );
}
