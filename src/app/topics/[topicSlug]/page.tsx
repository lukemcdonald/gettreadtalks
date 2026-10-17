import type { Metadata } from 'next';

import { Suspense } from 'react';

import { TopicPageContent } from '@/app/topics/[topicSlug]/_components/topic-page-content';
import { TopicPageSkeleton } from '@/app/topics/[topicSlug]/_components/topic-page-skeleton';
import { formatTopicTalkCountPhrase } from '@/app/topics/[topicSlug]/_components/topic-talks-description';
import { loadTopicBySlug } from '@/features/topics/queries/load-topic-by-slug';
import { buildTopicUrl } from '@/features/topics/utils';
import { buildPageMetadata } from '@/lib/metadata';

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
  const topicResult = await loadTopicBySlug({ slug: topicSlug });

  if (!topicResult) {
    return {};
  }

  const { topic, totalTalks } = topicResult;

  return buildPageMetadata({
    canonical: buildTopicUrl(topicSlug),
    description: `Elevate your spiritual heartbeat with ${formatTopicTalkCountPhrase(totalTalks)} on ${topic.title}.`,
    title: topic.title,
  });
}

export default function TopicPage({ params, searchParams }: TopicPageProps) {
  return (
    <Suspense fallback={<TopicPageSkeleton />}>
      <TopicPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
