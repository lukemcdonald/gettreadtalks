import type { Collection } from '@/features/collections/types';

import { ContentTable } from '@/components/content-table';
import { Empty, EmptyDescription } from '@/components/ui';

import { CollectionsTableRow } from './collections-table-row';

interface CollectionsTableProps {
  collections: { collection: Collection; talkCount: number }[];
}

export function CollectionsTable({ collections }: CollectionsTableProps) {
  if (collections.length === 0) {
    return (
      <Empty>
        <EmptyDescription>No collections found</EmptyDescription>
      </Empty>
    );
  }

  return (
    <ContentTable columns={['Title', 'Talks', 'Actions']}>
      {collections.map(({ collection, talkCount }) => (
        <CollectionsTableRow
          collection={collection}
          key={collection._id}
          talkCount={talkCount}
        />
      ))}
    </ContentTable>
  );
}
