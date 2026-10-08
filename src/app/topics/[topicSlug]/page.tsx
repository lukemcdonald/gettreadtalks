import type { Metadata } from 'next';

import { Suspense } from 'react';

import { TopicPageContent } from '@/app/topics/[topicSlug]/_components/topic-page-content';
import { TopicPageSkeleton } from '@/app/topics/[topicSlug]/_components/topic-page-skeleton';
import { getTopicBySlug } from '@/features/topics/queries/get-topic-by-slug';
import { pluralize } from '@/utils/pluralize';

// fallow-ignore-next-line unused-export
export const ensureStatic = 'shell';

interface TopicPageProps {
  params: Promise<{
    topicSlug: string;
  }>;
  searchParams: Promise<{
    cursor?: string;
    search?: string;
  }>;
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { topicSlug } = await params;
  const topicResult = await getTopicBySlug({ slug: topicSlug });

  if (!topicResult) {
    return {};
  }

  const { topic, totalTalks } = topicResult;
  const count = totalTalks === 1 ? 'this' : `these ${totalTalks}`;

  return {
    description: `Elevate your spiritual heartbeat with ${count} Christ centered ${pluralize(totalTalks, 'talk', 'talks')} on ${topic.title}.`,
    title: topic.title,
  };
}

export default function TopicPage({ params, searchParams }: TopicPageProps) {
  return (
    <Suspense fallback={<TopicPageSkeleton />}>
      <TopicPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
