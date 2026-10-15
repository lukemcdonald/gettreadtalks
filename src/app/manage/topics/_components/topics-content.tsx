import { TopicsTable } from '@/features/topics/components/topics-table/topics-table';
import { getAllTopics } from '@/features/topics/queries/get-all-topics';

export async function TopicsContent() {
  const { topics } = await getAllTopics();

  return <TopicsTable topics={topics} />;
}
