import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { buildTopicJsonLd } from '@/app/topics/[topicSlug]/_components/topic-json-ld';
import {
  TopicHeaderSkeleton,
  TopicSidebarSkeleton,
} from '@/app/topics/[topicSlug]/_components/topic-page-skeleton';
import { TopicSidebar } from '@/app/topics/[topicSlug]/_components/topic-sidebar';
import { TopicTalks } from '@/app/topics/[topicSlug]/_components/topic-talks';
import { formatTopicPageDescription } from '@/app/topics/[topicSlug]/_components/topic-talks-description';
import { AdminEditButton } from '@/components/admin-edit-button';
import { ArchiveBackLink } from '@/components/archive-back-link';
import { JsonLd } from '@/components/json-ld';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { TalksListSkeleton } from '@/features/talks/components/talks-list-skeleton';
import { loadTopicBySlug } from '@/features/topics/queries/load-topic-by-slug';
import { buildTopicUrl, buildTopicsPath } from '@/features/topics/utils';
import { buildBreadcrumbJsonLd } from '@/lib/json-ld';

interface TopicPageContentProps {
  params: Promise<{
    topicSlug: string;
  }>;
  searchParams: Promise<{
    cursor?: string;
    search?: string;
  }>;
}

async function TopicHeader({ topicSlug }: { topicSlug: string }) {
  const topicResult = await loadTopicBySlug({ slug: topicSlug });

  if (!topicResult) {
    notFound();
  }

  const { talks, topic, totalTalks } = topicResult;
  const description = formatTopicPageDescription(topic.description, totalTalks);
  const segments = [
    { href: buildTopicsPath(), label: 'Topics' },
    { href: buildTopicUrl(topicSlug), label: topic.title },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(segments)} />
      <JsonLd
        data={buildTopicJsonLd({
          description: topic.description,
          talks,
          title: topic.title,
          topicSlug,
        })}
      />
      <ArchiveBackLink href={buildTopicsPath()} label="Topics" />
      <PageHeader
        actions={<AdminEditButton entity="topics" id={topic._id} />}
        description={description}
        size="lg"
        title={topic.title}
      />
    </>
  );
}

export async function TopicPageContent({
  params,
  searchParams,
}: TopicPageContentProps) {
  const { topicSlug } = await params;

  return (
    <SidebarLayout
      content={
        <Suspense fallback={<TalksListSkeleton />}>
          <TopicTalks searchParams={searchParams} topicSlug={topicSlug} />
        </Suspense>
      }
      header={
        <Suspense fallback={<TopicHeaderSkeleton />}>
          <TopicHeader topicSlug={topicSlug} />
        </Suspense>
      }
      sidebar={
        <Suspense fallback={<TopicSidebarSkeleton />}>
          <TopicSidebar topicSlug={topicSlug} />
        </Suspense>
      }
      sidebarSticky
    />
  );
}
