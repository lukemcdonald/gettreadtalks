import { Suspense } from 'react';

import {
  ManageTable,
  ManageTableSkeleton,
} from '@/app/manage/_components/manage-table';
import { PageHeader } from '@/components/page-header';
import { NewTopicButton } from '@/features/topics/components/new-topic-button';
import { TopicsTableRow } from '@/features/topics/components/topics-table/topics-table-row';
import { getAllTopics } from '@/features/topics/queries/get-all-topics';

export default function ManageTopicsPage() {
  return (
    <>
      <PageHeader
        actions={<NewTopicButton />}
        description="Manage all topics"
        title="Manage Topics"
      />
      <Suspense fallback={<ManageTableSkeleton resource="topics" />}>
        <TopicsContent />
      </Suspense>
    </>
  );
}

async function TopicsContent() {
  const { topics } = await getAllTopics();

  return (
    <ManageTable
      emptyAction={<NewTopicButton />}
      isEmpty={topics.length === 0}
      resource="topics"
    >
      {topics.map(({ talkCount, topic }) => (
        <TopicsTableRow key={topic._id} talkCount={talkCount} topic={topic} />
      ))}
    </ManageTable>
  );
}
