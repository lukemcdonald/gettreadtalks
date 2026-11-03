import type { ManageListSearchParams } from '@/components/manage-table';

import { ManageNewButton } from '@/components/manage-new-button';
import { ManageTable } from '@/components/manage-table';
import { TopicsTableRow } from '@/features/topics/components/topics-table/topics-table-row';
import { loadAllTopics } from '@/features/topics/queries/load-all-topics';

interface ManageTopicsContentProps {
  searchParams: Promise<ManageListSearchParams>;
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
    <ManageTable
      continueCursor={result.continueCursor}
      cursor={cursor}
      emptyAction={<ManageNewButton entity="topics" />}
      isDone={result.isDone}
      isEmpty={result.topics.length === 0}
      isFiltered={Boolean(search?.trim())}
      itemCount={result.topics.length}
      resource="topics"
    >
      {result.topics.map(({ talkCount, topic }) => (
        <TopicsTableRow key={topic._id} talkCount={talkCount} topic={topic} />
      ))}
    </ManageTable>
  );
}
