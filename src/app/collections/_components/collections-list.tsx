import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';

import { GridList } from '@/components/grid-list';
import { ListEmpty } from '@/components/list-empty';
import { CollectionCard } from '@/features/collections/components';

type CollectionWithStats = {
  collection: Collection;
  speakers: Speaker[];
  talkCount: number;
};

type CollectionsListProps = {
  collections: CollectionWithStats[];
  hasActiveFilters: boolean;
};

/**
 * Renders collections in a grid.
 * Data is pre-filtered and sorted on the server.
 */
export function CollectionsList({ collections, hasActiveFilters }: CollectionsListProps) {
  if (collections.length === 0) {
    return (
      <ListEmpty
        clearPath="/collections"
        description="Check back later for more collections."
        filteredDescription="Try adjusting your filters."
        hasActiveFilters={hasActiveFilters}
        title="No collections found"
      />
    );
  }

  return (
    <GridList>
      {collections.map((item) => (
        <CollectionCard
          collection={{
            description: item.collection.description,
            slug: item.collection.slug,
            title: item.collection.title,
          }}
          key={item.collection._id}
          speakers={item.speakers.map((speaker) => ({
            firstName: speaker.firstName,
            imageUrl: speaker.imageUrl,
            lastName: speaker.lastName,
            slug: speaker.slug,
          }))}
          talkCount={item.talkCount}
        />
      ))}
    </GridList>
  );
}
