import type { MutationCtx, QueryCtx } from '../_generated/server';

import { getOneFrom } from 'convex-helpers/server/relationships';

/**
 * Normalizes text into a URL-friendly slug
 * @param text - The text to normalize (can be undefined, null, or empty string)
 * @returns A normalized slug string, or empty string if input is falsy
 */
export function slugify(text: string | undefined | null): string {
  if (!text) {
    return '';
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Tables that have a 'by_slug' index
type SlugTable = 'affiliateLinks' | 'clips' | 'collections' | 'speakers' | 'talks' | 'topics';

/**
 * Check if a slug already exists in a table
 * @param ctx - Database context (QueryCtx or MutationCtx)
 * @param table - Table name (must have a 'by_slug' index)
 * @param slug - Slug to check
 * @param excludeId - Optional ID to exclude from check (for updates)
 * @returns True if slug exists, false otherwise
 */
export async function slugExists(
  ctx: QueryCtx | MutationCtx,
  table: SlugTable,
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const existing = await getOneFrom(ctx.db, table, 'by_slug', slug);

  if (!existing) {
    return false;
  }

  // If excludeId is provided, check if it's the same record
  if (excludeId && existing._id === excludeId) {
    return false;
  }

  return true;
}
