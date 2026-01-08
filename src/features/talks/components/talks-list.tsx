'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { GridList } from '@/components/grid-list';
import { Empty, EmptyDescription } from '@/components/ui';
import { TalkCard } from './talk-card';

type TalkWithSpeaker = Talk & { speaker: Speaker | null };
type TalksListProps = {
  talks: TalkWithSpeaker[];
  /**
   * If true, enables filtering and sorting via URL search params.
   * If false, displays talks as-is without filtering.
   * @default true
   */
  enableFiltering?: boolean;
};

export function TalksList({ talks, enableFiltering = true }: TalksListProps) {
  const searchParams = useSearchParams();
  const search = enableFiltering ? searchParams.get('search')?.toLowerCase() || '' : '';
  const speakerSlug = enableFiltering ? searchParams.get('speaker') || 'all' : 'all';
  const topicSlug = enableFiltering ? searchParams.get('topic') || 'all' : 'all';
  const featuredParam = enableFiltering ? searchParams.get('featured') : null;
  const featuredOnly = featuredParam === 'true';
  const sort = enableFiltering ? searchParams.get('sort') || 'recent' : 'recent';

  const filteredAndSorted = useMemo(() => {
    let filtered = talks;

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (talk) =>
          talk.title.toLowerCase().includes(search) ||
          talk.description?.toLowerCase().includes(search),
      );
    }

    // Filter by speaker
    if (speakerSlug !== 'all') {
      filtered = filtered.filter((talk) => talk.speaker?.slug === speakerSlug);
    }

    // Filter by topic (uses topicSlugs array enriched server-side)
    if (topicSlug !== 'all') {
      filtered = filtered.filter((talk) => {
        // @ts-expect-error - topicSlugs is added by server-side enrichment
        return talk.topicSlugs?.includes(topicSlug);
      });
    }

    // Filter by featured
    if (featuredOnly) {
      filtered = filtered.filter((talk) => talk.featured);
    }

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
  }, [talks, search, speakerSlug, topicSlug, featuredOnly, sort]);

  if (filteredAndSorted.length === 0) {
    return (
      <Empty>
        <EmptyDescription>No talks found</EmptyDescription>
      </Empty>
    );
  }

  return (
    <GridList columns={{ default: 1, sm: 1, md: 2, lg: 2, xl: 2 }}>
      {filteredAndSorted.map((talk) => (
        <TalkCard
          featured={talk.featured}
          key={talk._id}
          speaker={
            talk.speaker
              ? {
                  firstName: talk.speaker.firstName,
                  imageUrl: talk.speaker.imageUrl,
                  lastName: talk.speaker.lastName,
                  slug: talk.speaker.slug,
                }
              : undefined
          }
          talk={{
            description: talk.description,
            slug: talk.slug,
            title: talk.title,
          }}
        />
      ))}
    </GridList>
  );
}
