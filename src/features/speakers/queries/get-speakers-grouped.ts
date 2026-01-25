'use server';

import { getSpeakers } from '@/features/speakers';

interface GetSpeakersGroupedProps {
  limit?: number;
  role?: string;
  search?: string;
  sort?: string;
}

/**
 * Get speakers grouped alphabetically by last name.
 */
export async function getSpeakersGrouped(args?: GetSpeakersGroupedProps) {
  const { limit, role, search, sort } = args ?? {};

  const { speakers } = await getSpeakers({
    limit,
    role,
    search,
    sort,
  });

  // Group speakers by first letter of last name
  const grouped = new Map<string, typeof speakers>();

  for (const speaker of speakers) {
    const firstLetter = speaker.lastName[0]?.toUpperCase() || 'Other';

    if (!grouped.has(firstLetter)) {
      grouped.set(firstLetter, []);
    }

    grouped.get(firstLetter)?.push(speaker);
  }

  // Convert to array and sort by letter
  const groups = Array.from(grouped.entries())
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

  return groups;
}
