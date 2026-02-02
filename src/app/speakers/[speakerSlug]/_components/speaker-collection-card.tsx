import type { Collection } from '@/features/collections/types';

import { FolderIcon } from 'lucide-react';

import { MediaCard } from '@/components/media-card';

interface SpeakerCollectionCardProps {
  collection: Pick<Collection, 'description' | 'slug' | 'title'>;
}

export function SpeakerCollectionCard({ collection }: SpeakerCollectionCardProps) {
  return (
    <MediaCard
      ariaLabel={collection.title}
      href={`/collections/${collection.slug}`}
      media={
        <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <FolderIcon className="size-5" />
        </div>
      }
      subtitle={collection.description}
      title={collection.title}
    />
  );
}
