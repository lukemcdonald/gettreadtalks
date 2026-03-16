import type { Collection } from '@/features/collections/types';

import { Badge, TableCell, TableRow } from '@/components/ui';
import { CollectionActionsMenu } from '@/features/collections/components/collection-actions-menu';
import { pluralize } from '@/utils';

interface CollectionsTableRowProps {
  collection: Collection;
  talkCount: number;
}

export function CollectionsTableRow({ collection, talkCount }: CollectionsTableRowProps) {
  return (
    <TableRow>
      <TableCell className="whitespace-normal font-medium">{collection.title}</TableCell>
      <TableCell className="w-[120px]">
        <Badge variant="secondary">
          {talkCount === 0 ? 'No talks' : `${talkCount} ${pluralize(talkCount, 'talk', 'talks')}`}
        </Badge>
      </TableCell>
      <TableCell className="w-px text-right">
        <CollectionActionsMenu collection={collection} talkCount={talkCount} />
      </TableCell>
    </TableRow>
  );
}
