/**
 * Generate a talk URL with speaker and talk slugs.
 * @param speakerSlug - Speaker slug identifier
 * @param talkSlug - Talk slug identifier
 * @returns URL path for the talk
 */
export function getTalkUrl(speakerSlug: string, talkSlug: string): string {
  return `/talks/${speakerSlug}/${talkSlug}`;
}
