import type { TalksSearchParams } from '@/app/talks/_components/talks-results';
import type { Metadata } from 'next';

import { Suspense } from 'react';

import { TalksResults } from '@/app/talks/_components/talks-results';
import { TalksSidebar } from '@/app/talks/_components/talks-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { SidebarFiltersSkeleton } from '@/components/skeletons';
import { getSpeakers } from '@/features/speakers/queries/get-speakers';
import { sortSpeakersByName } from '@/features/speakers/utils';
import { TalksListSkeleton } from '@/features/talks/components/talks-list-skeleton';
import { getTopicsWithCounts } from '@/features/topics/queries/get-topics-with-counts';

export const metadata: Metadata = {
  description:
    'Browse Christ centered talks from faithful ministers of the Gospel.',
  title: 'Talks',
};

interface TalksPageProps {
  searchParams: Promise<TalksSearchParams>;
}

export default async function TalksPage({ searchParams }: TalksPageProps) {
  const [speakersResult, topicsResult] = await Promise.all([
    getSpeakers(),
    getTopicsWithCounts(),
  ]);

  return (
    <SidebarLayout
      content={
        <Suspense fallback={<TalksListSkeleton />}>
          <TalksResults searchParams={searchParams} />
        </Suspense>
      }
      header={
        <PageHeader
          description="Elevate your spiritual heartbeat with Christ centered talks."
          size="lg"
          title="Talks"
        />
      }
      sidebar={
        <Suspense fallback={<SidebarFiltersSkeleton />}>
          <TalksSidebar
            speakers={sortSpeakersByName(speakersResult.speakers)}
            topics={topicsResult}
          />
        </Suspense>
      }
      sidebarSticky
    />
  );
}
