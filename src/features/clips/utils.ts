/**
 * Generate a clip URL from its slug.
 */
export function getClipUrl(clipSlug: string): string {
  return `/clips/${clipSlug}`;
}
