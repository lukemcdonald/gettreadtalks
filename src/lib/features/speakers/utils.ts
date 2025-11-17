import type { Speaker } from '@/lib/features/speakers/types';

type SpeakerNameFields = Pick<Speaker, 'firstName' | 'lastName'>;

/**
 * Get the full name of a speaker.
 *
 * @param speaker - Speaker object with firstName and lastName
 * @returns Full name string
 */
export function getSpeakerName(speaker: SpeakerNameFields): string {
  return `${speaker.firstName} ${speaker.lastName}`;
}

/**
 * Get the initials of a speaker.
 *
 * @param speaker - Speaker object with firstName and lastName
 * @returns Initials string (e.g., "JD")
 */
export function getSpeakerInitials(speaker: SpeakerNameFields): string {
  return `${speaker?.firstName?.[0]}${speaker?.lastName?.[0]}`;
}
