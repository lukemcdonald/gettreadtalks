import { ManageTable } from '@/app/manage/_components/manage-table';
import { NewTopicButton } from '@/features/topics/components/new-topic-button';
import { TopicsTableRow } from '@/features/topics/components/topics-table/topics-table-row';
import { getAllTopics } from '@/features/topics/queries/get-all-topics';

export async function TopicsContent() {
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
