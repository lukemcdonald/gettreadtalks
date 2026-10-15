import { TopicsContent } from '@/app/manage/topics/_components/topics-content';
import { PageHeader } from '@/components/page-header';
import { NewTopicButton } from '@/features/topics/components/new-topic-button';

export default function ManageTopicsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader description="Manage all topics" title="Manage Topics" />
        <NewTopicButton />
      </div>
      <TopicsContent />
    </div>
  );
}
