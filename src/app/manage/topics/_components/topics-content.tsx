import { ManageTable } from '@/components/manage-table';
import { NewTopicButton } from '@/features/topics/components/new-topic-button';
import { TopicsTableRow } from '@/features/topics/components/topics-table/topics-table-row';
import { loadAllTopics } from '@/features/topics/queries/load-all-topics';

export async function ManageTopicsContent() {
  const { topics } = await loadAllTopics();

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
