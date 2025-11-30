import { TopicsContent } from '@/app/topics/_components/topics-content';
import { TopicsSidebar } from '@/app/topics/_components/topics-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { getTopicsWithCounts } from '@/features/topics';

export default async function TopicsPage() {
  return <SidebarLayout content={<TopicsContent />} sidebar={<TopicsSidebar />} sidebarSticky />;
}
