import { TopicsContent } from '@/app/manage/topics/_components/topics-content';
import { PageHeader } from '@/components/page-header';
import { NewTopicButton } from '@/features/topics/components/new-topic-button';

export default function ManageTopicsPage() {
  return (
    <>
      <PageHeader
        actions={<NewTopicButton />}
        description="Manage all topics"
        title="Manage Topics"
      />
      <TopicsContent />
    </>
  );
}
