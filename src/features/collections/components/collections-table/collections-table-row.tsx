import type { Collection } from '@/features/collections/types';

import { CountBadge } from '@/components/count-badge';
import { ManageEditButton } from '@/components/manage-edit-button';
import { TableCell, TableRow } from '@/components/ui';
import { Link } from '@/components/ui/link';
import { CollectionActionsMenu } from '@/features/collections/components/collection-actions-menu';
import { getCollectionUrl } from '@/features/collections/utils';
import { getEntityEditPath, getManageTitleHref } from '@/lib/entities/paths';

interface CollectionsTableRowProps {
  collection: Collection;
  talkCount: number;
}

export function CollectionsTableRow({
  collection,
  talkCount,
}: CollectionsTableRowProps) {
  const editPath = getEntityEditPath('collections', collection._id);
  const href = getManageTitleHref({
    editPath,
    publicPath: talkCount > 0 ? getCollectionUrl(collection.slug) : undefined,
  });

  return (
    <TableRow>
      <TableCell className="font-medium whitespace-normal">
        <Link className="line-clamp-2 block hover:underline" href={href}>
          {collection.title}
        </Link>
      </TableCell>
      <TableCell className="w-[120px]">
        <CountBadge count={talkCount} label="talk" />
      </TableCell>
      <TableCell className="w-px text-right">
        <div className="flex items-center justify-end gap-1">
          <ManageEditButton
            entity="collections"
            id={collection._id}
            name={collection.title}
          />
          <CollectionActionsMenu
            collection={collection}
            talkCount={talkCount}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
