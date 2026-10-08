import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { TopicSidebar } from '@/app/topics/[topicSlug]/_components/topic-sidebar';
import { TopicTalks } from '@/app/topics/[topicSlug]/_components/topic-talks';
import { JsonLd } from '@/components/json-ld';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { SidebarContent } from '@/components/sidebar-content';
import { PageBreadcrumb, Skeleton } from '@/components/ui';
import { site } from '@/configs/site';
import { TalksListSkeleton } from '@/features/talks/components/talks-list-skeleton';
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

export default async function TopicPage({
  params,
  searchParams,
}: TopicPageProps) {
  const { topicSlug } = await params;
  const topicResult = await getTopicBySlug({ slug: topicSlug });

  if (!topicResult) {
    notFound();
  }

  const { talks, topic, totalTalks } = topicResult;

  const description = `Elevate your spiritual heartbeat with ${totalTalks === 1 ? 'this' : `these ${totalTalks}`} Christ centered ${pluralize(totalTalks, 'talk', 'talks')}.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    description,
    itemListElement: talks.map((talk, index) => ({
      '@type': 'ListItem',
      name: talk.title,
      position: index + 1,
      url: talk.speaker
        ? `${site.url}/talks/${talk.speaker.slug}/${talk.slug}`
        : undefined,
    })),
    name: topic.title,
    url: `${site.url}/topics/${topicSlug}`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
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
          <Suspense
            fallback={
              <SidebarContent className="space-y-4">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </SidebarContent>
            }
          >
            <TopicSidebar topic={topic} />
          </Suspense>
        }
        sidebarSticky
      />
    </>
  );
}
