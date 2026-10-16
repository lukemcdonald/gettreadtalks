import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { topicJsonLd } from '@/app/topics/[topicSlug]/_components/topic-json-ld';
import {
  TopicHeaderSkeleton,
  TopicSidebarSkeleton,
} from '@/app/topics/[topicSlug]/_components/topic-page-skeleton';
import { TopicSidebar } from '@/app/topics/[topicSlug]/_components/topic-sidebar';
import { TopicTalks } from '@/app/topics/[topicSlug]/_components/topic-talks';
import { topicTalkCountPhrase } from '@/app/topics/[topicSlug]/_components/topic-talks-description';
import { AdminEditButton } from '@/components/admin-edit-button';
import { ArchiveBackLink } from '@/components/archive-back-link';
import { JsonLd } from '@/components/json-ld';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { PageBreadcrumb } from '@/components/ui';
import { TalksListSkeleton } from '@/features/talks/components/talks-list-skeleton';
import { getTopicBySlug } from '@/features/topics/queries/get-topic-by-slug';
import { getTopicUrl, getTopicsPath } from '@/features/topics/utils';
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
      <ArchiveBackLink href={getTopicsPath()} label="Back to Topics">
        <PageHeader
          actions={<AdminEditButton entity="topics" id={topic._id} />}
          description={description}
          size="lg"
          title={topic.title}
        />
      </ArchiveBackLink>
    </>
  );
}

async function TopicBreadcrumb({ topicSlug }: { topicSlug: string }) {
  const topicResult = await getTopicBySlug({ slug: topicSlug });

  if (!topicResult) {
    notFound();
  }

  const segments = [
    { href: getTopicsPath(), label: 'Topics' },
    { href: getTopicUrl(topicSlug), label: topicResult.topic.title },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(segments)} />
      <PageBreadcrumb segments={segments} />
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
      breadcrumb={
        <Suspense>
          <TopicBreadcrumb topicSlug={topicSlug} />
        </Suspense>
      }
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
