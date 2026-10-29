import type { Collection } from '@/features/collections/types';

import { FolderIcon } from 'lucide-react';

import { MediaCard, MediaIconFrame } from '@/components/media-card';
import { buildCollectionPath } from '@/features/collections/utils';

interface CollectionMediaCardProps {
  collection: Pick<Collection, 'slug' | 'title'>;
  headingLevel?: 2 | 3;
}

export function CollectionMediaCard({
  collection,
  headingLevel,
}: CollectionMediaCardProps) {
  return (
    <MediaCard
      ariaLabel={collection.title}
      headingLevel={headingLevel}
      href={buildCollectionPath(collection)}
      media={
        <MediaIconFrame>
          <FolderIcon className="size-5" />
        </MediaIconFrame>
      }
      title={collection.title}
    />
  );
}
