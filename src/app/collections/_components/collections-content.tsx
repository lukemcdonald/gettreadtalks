import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';

import { Suspense } from 'react';

import { CollectionsList } from '@/app/collections/_components/collections-list';

type CollectionWithStats = {
  collection: Collection;
  speakers: Speaker[];
  talkCount: number;
};

type CollectionsContentProps = {
  collections: CollectionWithStats[];
};

export function CollectionsContent({ collections }: CollectionsContentProps) {
  return (
    <Suspense>
      <CollectionsList collections={collections} />
    </Suspense>
  );
}
