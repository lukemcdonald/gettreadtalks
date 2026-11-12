import type { Speaker } from '@/features/speakers/types';

import { buildPathQuery } from '@/lib/entities/paths';

type SpeakerNameFields = Pick<Speaker, 'firstName' | 'lastName'>;

/**
 * Get the full name of a speaker.
 *
 * @param speaker - Speaker object with firstName and lastName
 * @returns Full name string
 */
export function getSpeakerName(speaker?: SpeakerNameFields | null): string {
  return speaker ? `${speaker.firstName} ${speaker.lastName}` : '';
}

/**
 * Get the initials of a speaker.
 *
 * @param speaker - Speaker object with firstName and lastName
 * @returns Initials string (e.g., "JD")
 */
export function getSpeakerInitials(speaker?: SpeakerNameFields | null): string {
  return speaker ? `${speaker.firstName?.[0]}${speaker.lastName?.[0]}` : '';
}

export function buildSpeakerPath(speaker: Pick<Speaker, 'slug'>) {
  return `/speakers/${speaker.slug}`;
}

export function buildSpeakersPath(options?: { query?: { sort?: string } }) {
  return `/speakers${buildPathQuery(options?.query)}`;
}

/**
 * Sort speakers by name (immutable).
 */
export function sortSpeakersByName(speakers: Speaker[]) {
  return speakers.toSorted((a, b) =>
    getSpeakerName(a).localeCompare(getSpeakerName(b))
  );
}

/** Group speakers by the first letter of last name. */
export function groupSpeakersByLastName(speakers: Speaker[]) {
  const grouped = new Map<string, Speaker[]>();

  for (const speaker of speakers) {
    const firstLetter = speaker.lastName[0]?.toUpperCase() || 'Other';
    const items = grouped.get(firstLetter);

    if (items) {
      items.push(speaker);
    } else {
      grouped.set(firstLetter, [speaker]);
    }
  }

  return [...grouped.entries()]
    .map(([letter, items]) => {
      const sorted = items.toSorted((a, b) =>
        a.lastName.localeCompare(b.lastName)
      );
      const [first] = sorted;
      const last = sorted.at(-1);
      const range =
        first && last ? `${first.lastName}—${last.lastName}` : letter;

      return {
        items: sorted,
        letter,
        range,
      };
    })
    .toSorted((a, b) => a.letter.localeCompare(b.letter));
}
