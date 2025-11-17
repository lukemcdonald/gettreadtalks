'use client';

import type { Collection } from '@/lib/features/collections/types';
import type { Speaker } from '@/lib/features/speakers/types';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { CollectionCard } from '@/components/cards';
import { GridList } from '@/components/grid';
import { Empty, EmptyDescription } from '@/components/ui/empty';

type CollectionWithStats = {
  collection: Collection;
  speakers: Speaker[];
  talkCount: number;
};

type CollectionsListProps = {
  collections: CollectionWithStats[];
};

export function CollectionsList({ collections }: CollectionsListProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get('search')?.toLowerCase() || '';
  const speakerSlug = searchParams.get('speaker') || 'all';
  const sort = searchParams.get('sort') || 'most-talks';

  const filteredAndSorted = useMemo(() => {
    let filtered = collections;

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.collection.title.toLowerCase().includes(search) ||
          item.collection.description?.toLowerCase().includes(search),
      );
    }

    // Filter by speaker
    if (speakerSlug !== 'all') {
      filtered = filtered.filter((item) => item.speakers.some((s) => s.slug === speakerSlug));
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'alphabetical':
          return a.collection.title.localeCompare(b.collection.title);
        case 'most-talks':
          return b.talkCount - a.talkCount;
        case 'least-talks':
          return a.talkCount - b.talkCount;
        default:
          return b.talkCount - a.talkCount;
      }
    });

    return sorted;
  }, [collections, search, speakerSlug, sort]);

  if (filteredAndSorted.length === 0) {
    return (
      <Empty>
        <EmptyDescription>No collections found</EmptyDescription>
      </Empty>
    );
  }

  return (
    <GridList>
      {filteredAndSorted.map((item) => (
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
