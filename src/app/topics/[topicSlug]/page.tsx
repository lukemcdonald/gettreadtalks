import { notFound } from 'next/navigation';

import { TopicContent } from '@/app/topics/[topicSlug]/_components/topic-content';
import { TopicSidebar } from '@/app/topics/[topicSlug]/_components/topic-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getTopicBySlug } from '@/features/topics/queries/get-topic-by-slug';

interface TopicPageProps {
  params: Promise<{
    topicSlug: string;
  }>;
  searchParams: Promise<{
    cursor?: string;
    search?: string;
  }>;
}

export default async function TopicPage({ params, searchParams }: TopicPageProps) {
  const { topicSlug } = await params;
  const { cursor, search } = await searchParams;

  const topicResult = await getTopicBySlug({ cursor, search, slug: topicSlug });

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
      sidebar={<TopicSidebar hasActiveFilters={!!search} topic={topic} totalTalks={totalTalks} />}
      sidebarSticky
    />
  );
}
