'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/lib/services/auth/server';

/**
 * Get featured speakers for homepage.
 */
export async function getFeaturedSpeakers(limit = 6) {
  const token = await getAuthToken();

  return await fetchQuery(api.speakers.listFeaturedSpeakers, { limit }, { token });
}

/**
 * Get all speakers (flat list, not grouped).
 */
export async function getAllSpeakers() {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: 1000,
  };

  const result = await fetchQuery(api.speakers.listSpeakers, { paginationOpts }, { token });
  return result.page;
}

/**
 * Get all speakers grouped alphabetically by last name.
 */
export async function getAllSpeakersGrouped() {
  const speakers = await getAllSpeakers();

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

/**
 * Get speaker by slug with related talks, collections, and clips.
 */
export async function getSpeakerBySlug(slug: string) {
  const token = await getAuthToken();

  const speaker = await fetchQuery(api.speakers.getSpeakerBySlug, { slug }, { token });

  if (!speaker) {
    return null;
  }

  // Fetch related content
  const [talks, collections, clips] = await Promise.all([
    fetchQuery(api.talks.listTalksBySpeaker, { speakerId: speaker._id, limit: 20 }, { token }),
    fetchQuery(api.collections.listCollectionsBySpeaker, { speakerId: speaker._id }, { token }),
    fetchQuery(api.clips.listClipsBySpeaker, { speakerId: speaker._id, limit: 20 }, { token }),
  ]);

  return {
    clips,
    collections,
    speaker,
    talks,
  };
}
