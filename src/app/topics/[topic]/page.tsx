import { notFound } from 'next/navigation';

import { TopicContent } from '@/app/topics/[topic]/_components/topic-content';
import { TopicSidebar } from '@/app/topics/[topic]/_components/topic-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getTopicBySlug } from '@/features/topics/queries/get-topic-by-slug';
import { getTopics } from '@/features/topics/queries/get-topics';

interface TopicPageProps {
  params: Promise<{
    topic: string;
  }>;
  searchParams: Promise<{
    cursor?: string;
  }>;
}

export default async function TopicPage({ params, searchParams }: TopicPageProps) {
  const { topic: slug } = await params;
  const { cursor } = await searchParams;

  const [topicResult, topicsResult] = await Promise.all([
    getTopicBySlug({ cursor, slug }),
    getTopics(),
  ]);

  if (!topicResult) {
    notFound();
  }

  const { continueCursor, isDone, talks, topic, totalTalks } = topicResult;

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
      header={<PageHeader title={topic.title} variant="lg" />}
      sidebar={
        <TopicSidebar currentSlug={slug} topics={topicsResult.topics} totalTalks={totalTalks} />
      }
      sidebarSticky
    />
  );
}
