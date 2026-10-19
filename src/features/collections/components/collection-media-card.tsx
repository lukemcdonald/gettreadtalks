import type { Collection } from '@/features/collections/types';

import { FolderIcon } from 'lucide-react';

import { MediaCard, MediaIconFrame } from '@/components/media-card';
import { buildCollectionPath } from '@/features/collections/utils';

interface CollectionMediaCardProps {
  collection: Pick<Collection, 'slug' | 'title'>;
}

export function CollectionMediaCard({ collection }: CollectionMediaCardProps) {
  return (
    <MediaCard
      ariaLabel={collection.title}
      href={buildCollectionPath(collection.slug)}
      media={
        <MediaIconFrame>
          <FolderIcon className="size-5" />
        </MediaIconFrame>
      }
      title={collection.title}
    />
  );
}
