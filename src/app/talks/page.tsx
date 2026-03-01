import type { Metadata } from 'next';

import { TalksContent } from '@/app/talks/_components/talks-content';
import { TalksSidebar } from '@/app/talks/_components/talks-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getSpeakers } from '@/features/speakers/queries/get-speakers';
import { sortSpeakersByName } from '@/features/speakers/utils';
import { getTalks } from '@/features/talks/queries/get-talks';
import { getTopicsWithCounts } from '@/features/topics/queries/get-topics-with-counts';

export const metadata: Metadata = {
  description: 'Browse Christ centered talks from faithful ministers of the Gospel.',
  title: 'Talks',
};

export interface TalksPageSearchParams {
  cursor?: string;
  featured?: string;
  search?: string;
  sort?: string;
  speakers?: string;
  topics?: string;
}

interface TalksPageProps {
  searchParams: Promise<TalksPageSearchParams>;
}

export default async function TalksPage({ searchParams }: TalksPageProps) {
  const params = await searchParams;
  const { cursor, featured, search, sort, speakers, topics } = params;

  // Parse comma-separated values into arrays
  const speakerSlugs = speakers ? speakers.split(',').filter(Boolean) : undefined;
  const topicSlugs = topics ? topics.split(',').filter(Boolean) : undefined;

  // Check if any filters are active (for showing "clear filters" option)
  const hasActiveFilters = !!(
    search ||
    speakerSlugs?.length ||
    topicSlugs?.length ||
    featured === 'true'
  );

  const [result, speakersResult, topicsResult] = await Promise.all([
    getTalks({
      cursor,
      featured: featured === 'true',
      search,
      sort,
      speakerSlugs,
      topicSlugs,
    }),
    getSpeakers(),
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
      sidebar={<TalksSidebar speakers={sortedSpeakers} topics={topicsResult} />}
      sidebarSticky
    />
  );
}
