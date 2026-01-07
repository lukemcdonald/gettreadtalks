import type { TalksPageSearchParams } from '@/app/talks/page';
import type { Speaker } from '@/features/speakers/types';
import type { Topic } from '@/features/topics/types';

import { Suspense } from 'react';

import { Pagination } from '@/app/talks/_components/pagination';
import { getTalksWithSpeakers } from '@/features/talks';
import { TalksList, TalksListSkeleton } from '@/features/talks/components';

type TopicWithCount = {
  count: number;
  topic: Topic;
};

type TalksContentProps = {
  searchParams: TalksPageSearchParams;
  speakers: Speaker[];
  topics: TopicWithCount[];
};

export async function TalksContent({ searchParams, speakers, topics }: TalksContentProps) {
  const {
    cursor,
    featured: featuredParam,
    search,
    speaker: speakerSlug,
    topic: topicSlug,
  } = searchParams;

  // Convert speaker/topic slugs to IDs
  const speakerId = speakerSlug ? speakers.find((s) => s.slug === speakerSlug)?._id : undefined;

  const topicId = topicSlug ? topics.find((t) => t.topic.slug === topicSlug)?.topic._id : undefined;

  const featured = featuredParam === 'true' ? true : undefined;

  const result = await getTalksWithSpeakers({
    cursor,
    featured,
    limit: 20,
    search,
    speakerId,
    topicId,
  });

  return (
    <Suspense fallback={<TalksListSkeleton />}>
      <TalksList talks={result.talks} />
      <Pagination
        continueCursor={result.continueCursor}
        hasNextPage={!result.isDone}
        hasPrevPage={!!cursor}
      />
    </Suspense>
  );
}
