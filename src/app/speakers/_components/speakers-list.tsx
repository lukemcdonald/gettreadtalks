'use client';

import type { Speaker } from '@/features/speakers/types';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { AlphabeticalGrid } from '@/components/alphabetical-grid';
import { SpeakerCard } from '@/components/speaker-card';
import { Empty, EmptyDescription } from '@/components/ui';
import { getSpeakerName } from '@/features/speakers';

type SpeakersListProps = {
  speakers: Speaker[];
};

export function SpeakersList({ speakers }: SpeakersListProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get('search')?.toLowerCase() || '';
  const role = searchParams.get('role') || 'all';
  const sort = searchParams.get('sort') || 'alphabetical';

  const filteredAndSorted = useMemo(() => {
    let filtered = speakers;

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (speaker) =>
          speaker.firstName.toLowerCase().includes(search) ||
          speaker.lastName.toLowerCase().includes(search) ||
          getSpeakerName(speaker).toLowerCase().includes(search),
      );
    }

    // Filter by role
    if (role !== 'all') {
      filtered = filtered.filter((speaker) => speaker.role === role);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'alphabetical':
          return a.lastName.localeCompare(b.lastName);
        case 'featured':
          if (a.featured && !b.featured) {
            return -1;
          }
          if (!a.featured && b.featured) {
            return 1;
          }
          return a.lastName.localeCompare(b.lastName);
        default:
          return a.lastName.localeCompare(b.lastName);
      }
    });

    return sorted;
  }, [speakers, search, role, sort]);

  // Group by first letter of last name
  const grouped = useMemo(() => {
    const groups = new Map<string, Speaker[]>();

    for (const speaker of filteredAndSorted) {
      const firstLetter = speaker.lastName[0]?.toUpperCase() || 'Other';
      if (!groups.has(firstLetter)) {
        groups.set(firstLetter, []);
      }
      groups.get(firstLetter)?.push(speaker);
    }

    return Array.from(groups.entries())
      .map(([letter, items]) => {
        const sorted = items.sort((a, b) => a.lastName.localeCompare(b.lastName));
        const first = sorted[0];
        const last = sorted.at(-1);
        const range = first && last ? `${first.lastName}—${last.lastName}` : letter;

        return {
          items: sorted,
          letter,
          range,
        };
      })
      .sort((a, b) => a.letter.localeCompare(b.letter));
  }, [filteredAndSorted]);

  if (filteredAndSorted.length === 0) {
    return (
      <Empty>
        <EmptyDescription>No speakers found</EmptyDescription>
      </Empty>
    );
  }

  return (
    <AlphabeticalGrid
      groups={grouped.map((group) => ({
        items: group.items.map((speaker) => (
          <SpeakerCard
            key={speaker._id}
            speaker={{
              featured: speaker.featured,
              firstName: speaker.firstName,
              imageUrl: speaker.imageUrl,
              lastName: speaker.lastName,
              role: speaker.role,
              slug: speaker.slug,
            }}
          />
        )),
        letter: group.letter,
        range: group.range,
      }))}
    />
  );
}
