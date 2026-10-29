import { ManageTable } from '@/components/manage-table';
import { Pagination } from '@/components/pagination';
import { NewTopicButton } from '@/features/topics/components/new-topic-button';
import { TopicsTableRow } from '@/features/topics/components/topics-table/topics-table-row';
import { loadAllTopics } from '@/features/topics/queries/load-all-topics';

export interface ManageTopicsSearchParams {
  cursor?: string;
  search?: string;
}

interface ManageTopicsContentProps {
  searchParams: Promise<ManageTopicsSearchParams>;
}

export async function ManageTopicsContent({
  searchParams,
}: ManageTopicsContentProps) {
  const { cursor, search } = await searchParams;
  const result = await loadAllTopics({
    cursor,
    limit: 50,
    search,
  });

  return (
    <div className="space-y-6">
      <ManageTable
        emptyAction={<NewTopicButton />}
        isEmpty={result.topics.length === 0}
        isFiltered={Boolean(search?.trim())}
        resource="topics"
      >
        {result.topics.map(({ talkCount, topic }) => (
          <TopicsTableRow key={topic._id} talkCount={talkCount} topic={topic} />
        ))}
      </ManageTable>
      <Pagination
        continueCursor={result.continueCursor}
        hasNextPage={!result.isDone}
        hasPrevPage={!!cursor}
        itemCount={result.topics.length}
      />
    </div>
  );
}
