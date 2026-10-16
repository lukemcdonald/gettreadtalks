import type { ManageStatus } from '@/app/manage/_components/manage-table';
import type { Collection } from '@/features/collections/types';

import {
  ManageCountCell,
  ManageRow,
} from '@/app/manage/_components/manage-table';
import { CollectionActionsMenu } from '@/features/collections/components/collection-actions-menu';
import { buildCollectionUrl } from '@/features/collections/utils';
import { buildEntityEditPath } from '@/lib/entities/paths';

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
  const editPath = buildEntityEditPath('collections', collection._id);
  const viewUrl =
    status === 'published' ? buildCollectionUrl(collection.slug) : undefined;

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
    >
      <ManageCountCell>{talkCount}</ManageCountCell>
    </ManageRow>
  );
}
