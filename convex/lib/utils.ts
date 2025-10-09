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

import type { MutationCtx, QueryCtx } from '../_generated/server';

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
  const existing = await ctx.db
    .query(table)
    .withIndex('by_slug', (q) => q.eq('slug', slug))
    .first();

  if (!existing) {
    return false;
  }

  // If excludeId is provided, check if it's the same record
  if (excludeId && existing._id === excludeId) {
    return false;
  }

  return true;
}
