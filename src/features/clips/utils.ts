/**
 * Generate a clip URL from its slug.
 */
export function buildClipUrl(clipSlug: string): string {
  return `/clips/${clipSlug}`;
}

export function buildClipsPath() {
  return '/clips';
}
