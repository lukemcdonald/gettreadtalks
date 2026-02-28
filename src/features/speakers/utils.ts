import type { Speaker } from '@/features/speakers/types';

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

/**
 * Sort speakers by name (immutable).
 */
export function sortSpeakersByName(speakers: Speaker[]) {
  return speakers.toSorted((a, b) => getSpeakerName(a).localeCompare(getSpeakerName(b)));
}
