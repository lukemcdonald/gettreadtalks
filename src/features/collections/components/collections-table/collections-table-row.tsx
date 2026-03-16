import type { Collection } from '@/features/collections/types';

import { CountBadge } from '@/components/count-badge';
import { TableCell, TableRow } from '@/components/ui';
import { CollectionActionsMenu } from '@/features/collections/components/collection-actions-menu';

interface CollectionsTableRowProps {
  collection: Collection;
  talkCount: number;
}

export function CollectionsTableRow({ collection, talkCount }: CollectionsTableRowProps) {
  return (
    <TableRow>
      <TableCell className="whitespace-normal font-medium">{collection.title}</TableCell>
      <TableCell className="w-[120px]">
        <CountBadge count={talkCount} label="talk" />
      </TableCell>
      <TableCell className="w-px text-right">
        <CollectionActionsMenu collection={collection} talkCount={talkCount} />
      </TableCell>
    </TableRow>
  );
}
