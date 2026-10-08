import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { topicJsonLd } from '@/app/topics/[topicSlug]/_components/topic-json-ld';
import { TopicSidebarSkeleton } from '@/app/topics/[topicSlug]/_components/topic-page-skeleton';
import { TopicSidebar } from '@/app/topics/[topicSlug]/_components/topic-sidebar';
import { TopicTalks } from '@/app/topics/[topicSlug]/_components/topic-talks';
import { topicTalkCountPhrase } from '@/app/topics/[topicSlug]/_components/topic-talks-description';
import { JsonLd } from '@/components/json-ld';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { PageBreadcrumb } from '@/components/ui';
import { TalksListSkeleton } from '@/features/talks/components/talks-list-skeleton';
import { getTopicBySlug } from '@/features/topics/queries/get-topic-by-slug';

interface TopicPageContentProps {
  params: Promise<{
    topicSlug: string;
  }>;
  searchParams: Promise<{
    cursor?: string;
    search?: string;
  }>;
}

export async function TopicPageContent({
  params,
  searchParams,
}: TopicPageContentProps) {
  const { topicSlug } = await params;
  const topicResult = await getTopicBySlug({ slug: topicSlug });

  if (!topicResult) {
    notFound();
  }

  const { talks, topic, totalTalks } = topicResult;

  const description = `Elevate your spiritual heartbeat with ${topicTalkCountPhrase(totalTalks)}.`;

  return (
    <>
      <JsonLd
        data={topicJsonLd({
          description,
          talks,
          title: topic.title,
          topicSlug,
        })}
      />
      <SidebarLayout
        breadcrumb={
          <PageBreadcrumb
            segments={[
              { href: '/topics', label: 'Topics' },
              { label: topic.title },
            ]}
          />
        }
        content={
          <Suspense fallback={<TalksListSkeleton />}>
            <TopicTalks searchParams={searchParams} topicSlug={topicSlug} />
          </Suspense>
        }
        header={
          <PageHeader description={description} size="lg" title={topic.title} />
        }
        sidebar={
          <Suspense fallback={<TopicSidebarSkeleton />}>
            <TopicSidebar topic={topic} />
          </Suspense>
        }
        sidebarSticky
      />
    </>
  );
}
