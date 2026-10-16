import type { ManageStatus } from '@/app/manage/_components/manage-table';
import type { Collection } from '@/features/collections/types';

import {
  ManageCountCell,
  ManageRow,
} from '@/app/manage/_components/manage-table';
import { CollectionActionsMenu } from '@/features/collections/components/collection-actions-menu';
import { getCollectionUrl } from '@/features/collections/utils';
import { getEntityEditPath } from '@/lib/entities/paths';

interface CollectionsTableRowProps {
  collection: Collection;
  status: ManageStatus;
  talkCount: number;
}

export function CollectionsTableRow({
  collection,
  status,
  talkCount,
}: CollectionsTableRowProps) {
  const editPath = getEntityEditPath('collections', collection._id);
  const viewUrl =
    status === 'published' ? getCollectionUrl(collection.slug) : undefined;

  return (
    <ManageRow
      actions={
        <CollectionActionsMenu
          collection={collection}
          talkCount={talkCount}
          viewUrl={viewUrl}
        />
      }
      editHref={editPath}
      status={status}
      title={collection.title}
      updatedAt={collection.updatedAt ?? collection._creationTime}
    >
      <ManageCountCell>{talkCount}</ManageCountCell>
    </ManageRow>
  );
}
