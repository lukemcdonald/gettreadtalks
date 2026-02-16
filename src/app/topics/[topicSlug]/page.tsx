import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { TopicContent } from '@/app/topics/[topicSlug]/_components/topic-content';
import { TopicSidebar } from '@/app/topics/[topicSlug]/_components/topic-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getTopicBySlug } from '@/features/topics/queries/get-topic-by-slug';
import { pluralize } from '@/utils/pluralize';

interface TopicPageProps {
  params: Promise<{
    topicSlug: string;
  }>;
  searchParams: Promise<{
    cursor?: string;
    search?: string;
  }>;
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { topicSlug } = await params;
  const topicResult = await getTopicBySlug({ slug: topicSlug });

  if (!topicResult) return {};

  const { topic, totalTalks } = topicResult;
  const count = totalTalks === 1 ? 'this' : `these ${totalTalks}`;
  const noun = totalTalks === 1 ? 'talk' : 'talks';

  return {
    description: `Elevate your spiritual heartbeat with ${count} Christ centered ${noun} on ${topic.title}.`,
    title: topic.title,
  };
}

export default async function TopicPage({ params, searchParams }: TopicPageProps) {
  const { topicSlug } = await params;
  const { cursor, search } = await searchParams;

  const topicResult = await getTopicBySlug({ cursor, search, slug: topicSlug });

  if (!topicResult) {
    notFound();
  }

  const { continueCursor, isDone, talks, topic, totalTalks } = topicResult;

  const description = `Elevate your spiritual heartbeat with ${totalTalks === 1 ? 'this' : `these ${totalTalks}`} Christ centered ${pluralize(totalTalks, 'talk', 'talks')}.`;

  return (
    <SidebarLayout
      content={
        <TopicContent
          continueCursor={continueCursor}
          hasNextPage={!isDone}
          hasPrevPage={!!cursor}
          talks={talks}
        />
      }
      header={<PageHeader description={description} title={topic.title} variant="lg" />}
      sidebar={<TopicSidebar hasActiveFilters={!!search} topic={topic} />}
      sidebarSticky
    />
  );
}
