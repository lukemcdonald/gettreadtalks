import { notFound } from 'next/navigation';

import { TopicContent } from '@/app/topics/[topic]/_components/topic-content';
import { TopicSidebar } from '@/app/topics/[topic]/_components/topic-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getTopicBySlug, getTopics } from '@/features/topics';

export type TopicPageSearchParams = {
  cursor?: string;
};

type TopicPageProps = {
  params: Promise<{
    topic: string;
  }>;
  searchParams: Promise<TopicPageSearchParams>;
};

export default async function TopicPage({ params, searchParams }: TopicPageProps) {
  const { topic: slug } = await params;
  const { cursor } = await searchParams;

  const [data, topicsResult] = await Promise.all([getTopicBySlug({ cursor, slug }), getTopics()]);

  if (!data) {
    notFound();
  }

  const { continueCursor, isDone, talks, topic, totalTalks } = data;
  const allTopics = topicsResult.topics;

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
      sidebar={<TopicSidebar currentSlug={slug} topics={allTopics} totalTalks={totalTalks} />}
      sidebarSticky
    />
  );
}
