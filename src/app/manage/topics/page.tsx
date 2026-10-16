import { Suspense } from 'react';

import { ManageTableSkeleton } from '@/app/manage/_components/manage-table';
import { ManageTopicsContent } from '@/app/manage/topics/_components/topics-content';
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
      <Suspense fallback={<ManageTableSkeleton resource="topics" />}>
        <ManageTopicsContent />
      </Suspense>
    </>
  );
}
