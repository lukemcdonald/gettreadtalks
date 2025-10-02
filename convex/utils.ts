/**
 * Normalizes text into a URL-friendly slug
 * @param text - The text to normalize
 * @returns A normalized slug string
 */
export function normalizeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
