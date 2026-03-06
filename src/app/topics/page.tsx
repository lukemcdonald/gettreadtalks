import type { Metadata } from 'next';

import { TopicsBrowseContent } from '@/app/topics/_components/topics-browse-content';
import { TopicsSidebar } from '@/app/topics/_components/topics-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getTopicsWithTalks } from '@/features/topics/queries/get-topics-with-talks';

export const metadata: Metadata = {
  description: 'Browse talks by Bible topic or theme and deepen your understanding of Scripture.',
  title: 'Topics',
};

export default async function TopicsPage() {
  const topicsWithTalks = await getTopicsWithTalks();

  return (
    <SidebarLayout
      content={<TopicsBrowseContent topics={topicsWithTalks} />}
      header={
        <PageHeader
          description="Browse talks organized by Bible topic or theme."
          size="lg"
          title="Topics"
        />
      }
      sidebar={<TopicsSidebar topics={topicsWithTalks} />}
      sidebarSticky
    />
  );
}
