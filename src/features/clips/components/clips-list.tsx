'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { GridList } from '@/components/grid-list';
import { Empty, EmptyDescription } from '@/components/ui';
import { ClipCard } from './clip-card';

type ClipWithSpeaker = {
  _id: string;
  description?: string;
  publishedAt?: number;
  slug: string;
  title: string;
  speaker?: {
    firstName: string;
    imageUrl?: string;
    lastName: string;
    slug: string;
  } | null;
};

type ClipsListProps = {
  clips: ClipWithSpeaker[];
  /**
   * If true, enables filtering and sorting via URL search params.
   * If false, displays clips as-is without filtering.
   * @default true
   */
  enableFiltering?: boolean;
};

export function ClipsList({ clips, enableFiltering = true }: ClipsListProps) {
  const searchParams = useSearchParams();
  const search = enableFiltering ? searchParams.get('search')?.toLowerCase() || '' : '';
  const speakerSlug = enableFiltering ? searchParams.get('speaker') || 'all' : 'all';
  const sort = enableFiltering ? searchParams.get('sort') || 'recent' : 'recent';

  const filteredAndSorted = useMemo(() => {
    let filtered = clips;

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (clip) =>
          clip.title.toLowerCase().includes(search) ||
          clip.description?.toLowerCase().includes(search),
      );
    }

    // Filter by speaker
    if (speakerSlug !== 'all') {
      filtered = filtered.filter((clip) => clip.speaker?.slug === speakerSlug);
    }

    // Note: Topic filtering would require fetching topics for each clip
    // For now, we'll skip topic filtering or implement it server-side

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'recent':
          return (b.publishedAt || 0) - (a.publishedAt || 0);
        case 'oldest':
          return (a.publishedAt || 0) - (b.publishedAt || 0);
        default:
          return (b.publishedAt || 0) - (a.publishedAt || 0);
      }
    });

    return sorted;
  }, [clips, search, speakerSlug, sort]);

  if (filteredAndSorted.length === 0) {
    return (
      <Empty>
        <EmptyDescription>No clips found</EmptyDescription>
      </Empty>
    );
  }

  return (
    <GridList columns={{ default: 1, sm: 1, md: 2, lg: 2, xl: 2 }}>
      {filteredAndSorted.map((clip) => (
        <ClipCard
          clip={{
            description: clip.description,
            slug: clip.slug,
            title: clip.title,
          }}
          key={clip._id}
          speaker={
            clip.speaker
              ? {
                  firstName: clip.speaker.firstName,
                  imageUrl: clip.speaker.imageUrl,
                  lastName: clip.speaker.lastName,
                  slug: clip.speaker.slug,
                }
              : undefined
          }
        />
      ))}
    </GridList>
  );
}
