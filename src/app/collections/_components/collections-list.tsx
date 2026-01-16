'use client';

import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { GridList } from '@/components/grid-list';
import { Empty, EmptyDescription } from '@/components/ui';
import { CollectionCard } from '@/features/collections/components';

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
  const speakerSlug = searchParams.get('speakerSlug') || 'all';
  const sort = searchParams.get('sort') || 'alphabetical';

  const filteredAndSorted = useMemo(() => {
    let filtered = collections;

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        ({ collection }) =>
          collection.title.toLowerCase().includes(search) ||
          collection.description?.toLowerCase().includes(search),
      );
    }

    // Filter by speaker
    if (speakerSlug !== 'all') {
      filtered = filtered.filter((item) => item.speakers.some((s) => s.slug === speakerSlug));
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'most-talks':
          return b.talkCount - a.talkCount;
        case 'least-talks':
          return a.talkCount - b.talkCount;
        default:
          return a.collection.title.localeCompare(b.collection.title);
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
