import type { StatusType } from '@/convex/lib/validators/shared';
import type { SpeakerId } from '@/lib/features/speakers/types';
import type { TopicId } from '@/lib/features/topics/types';

import { Suspense } from 'react';

import { FilterUtilityBar } from '@/components/filter-utility-bar';
import { ArchiveLayout } from '@/components/layouts/archive-layout';
import { ArchiveSidebar } from '@/components/layouts/archive-sidebar';
import { getAllSpeakersForFilter, getAllTopicsForFilter, getTalks } from '@/lib/features/talks';
import { getCurrentUser } from '@/lib/services/auth/server';
import { Pagination } from './_components/pagination';
import { TalksList } from './_components/talks-list';
import { TalksListSkeleton } from './_components/talks-list-skeleton';

type TalksPageProps = {
  searchParams: Promise<{
    cursor?: string;
    featured?: string;
    search?: string;
    speaker?: string;
    status?: string;
    topic?: string;
  }>;
};

async function TalksContent({ params }: { params: Awaited<TalksPageProps['searchParams']> }) {
  const user = await getCurrentUser();

  const cursor = params.cursor || undefined;
  const featured = params.featured === 'true' ? true : undefined;
  const search = params.search || undefined;
  const speakerId = params.speaker as SpeakerId | undefined;
  const topicId = params.topic as TopicId | undefined;
  const statusParam = params.status as StatusType | undefined;

  const status = user
    ? statusParam
    : statusParam ||
      (featured === undefined && !speakerId && !topicId && !search ? 'published' : undefined);

  const result = await getTalks({
    cursor,
    featured,
    search,
    speakerId,
    status,
    topicId,
  });

  return (
    <>
      <TalksList talks={result.talks} />
      <Pagination
        continueCursor={result.continueCursor}
        hasNextPage={!result.isDone}
        hasPrevPage={!!cursor}
      />
    </>
  );
}

export default async function TalksPage({ searchParams }: TalksPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();

  // Fetch filter data (not affected by pagination)
  const [speakers, topics] = await Promise.all([
    getAllSpeakersForFilter(),
    getAllTopicsForFilter(),
  ]);

  return (
    <ArchiveLayout
      sidebar={
        <ArchiveSidebar
          description="Elevate your spiritual heartbeat with Christ centered talks."
          title="Talks"
        />
      }
    >
      <div className="space-y-6">
        <FilterUtilityBar isAuthenticated={!!user} speakers={speakers} topics={topics} />

        <Suspense fallback={<TalksListSkeleton />}>
          <TalksContent params={params} />
        </Suspense>
      </div>
    </ArchiveLayout>
  );
}
