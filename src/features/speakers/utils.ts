import type { Speaker } from '@/features/speakers/types';

type SpeakerNameFields = Pick<Speaker, 'firstName' | 'lastName'>;

/**
 * Get the full name of a speaker.
 *
 * @param speaker - Speaker object with firstName and lastName
 * @returns Full name string
 */
export function getSpeakerName(speaker?: SpeakerNameFields): string {
  return speaker ? `${speaker.firstName} ${speaker.lastName}` : '';
}

/**
 * Get the initials of a speaker.
 *
 * @param speaker - Speaker object with firstName and lastName
 * @returns Initials string (e.g., "JD")
 */
export function getSpeakerInitials(speaker?: SpeakerNameFields): string {
  return speaker ? `${speaker.firstName?.[0]}${speaker.lastName?.[0]}` : '';
}

/**
 * Sort speakers by name.
 *
 * @param speakers - Array of speakers with firstName and lastName
 * @returns Sorted array of speakers
 */
export function sortSpeakersByName(speakers: Speaker[]) {
  if (speakers.length === 0) {
    return [];
  }
  return speakers.sort((a, b) => getSpeakerName(a).localeCompare(getSpeakerName(b)));
}
