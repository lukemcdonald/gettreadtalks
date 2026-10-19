import type { Metadata } from 'next';

import { Suspense } from 'react';

import { TopicsBrowseContent } from '@/app/topics/_components/topics-browse-content';
import { TopicsBrowseSkeleton } from '@/app/topics/_components/topics-browse-skeleton';
import { TopicsSidebar } from '@/app/topics/_components/topics-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { SidebarFiltersSkeleton } from '@/components/skeletons';
import { loadTopicsWithTalks } from '@/features/topics/queries/load-topics-with-talks';
import { buildTopicsPath } from '@/features/topics/utils';
import { buildPageMetadata } from '@/lib/metadata';

// fallow-ignore-next-line unused-export
export const ensureStatic = 'shell';

export const metadata: Metadata = buildPageMetadata({
  canonical: buildTopicsPath(),
  description:
    'Browse talks by Bible topic or theme and deepen your understanding of Scripture.',
  title: 'Topics',
});

export default async function TopicsPage() {
  const topicsWithTalks = await loadTopicsWithTalks();

  return (
    <SidebarLayout
      content={
        <Suspense fallback={<TopicsBrowseSkeleton />}>
          <TopicsBrowseContent topics={topicsWithTalks} />
        </Suspense>
      }
      header={
        <PageHeader
          description="Browse talks organized by Bible topic or theme."
          size="lg"
          title="Topics"
        />
      }
      sidebar={
        <Suspense fallback={<SidebarFiltersSkeleton />}>
          <TopicsSidebar topics={topicsWithTalks} />
        </Suspense>
      }
      sidebarSticky
    />
  );
}
