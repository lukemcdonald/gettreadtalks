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

import type { QueryCtx, MutationCtx } from '../_generated/server';

/**
 * Check if a slug already exists in a table
 * @param ctx - Database context (QueryCtx or MutationCtx)
 * @param table - Table name
 * @param slug - Slug to check
 * @param excludeId - Optional ID to exclude from check (for updates)
 * @returns True if slug exists, false otherwise
 */
export async function slugExists(
  ctx: QueryCtx | MutationCtx,
  table: string,
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const existing = await ctx.db
    .query(table as any)
    .withIndex('by_slug', (q: any) => q.eq('slug', slug))
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

/**
 * Get default limit based on content type
 * @param contentType - Type of content
 * @returns Default limit number
 */
export function getDefaultLimit(contentType: 'main' | 'content' | 'related'): number {
  switch (contentType) {
    case 'main':
      return 100; // For main entity lists
    case 'content':
      return 50; // For content-heavy queries
    case 'related':
      return 20; // For related data
    default:
      return 50;
  }
}
