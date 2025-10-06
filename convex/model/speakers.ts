import type { DatabaseReader } from '../_generated/server';
import type { Doc } from '../_generated/dataModel';

/**
 * Get speaker by slug
 * @param ctx - Database context
 * @param slug - Speaker slug
 * @returns Speaker or null if not found
 */
export async function getBySlug(
  ctx: DatabaseReader,
  slug: string,
): Promise<Doc<'speakers'> | null> {
  return await ctx
    .query('speakers')
    .withIndex('by_slug', (q) => q.eq('slug', slug))
    .unique();
}
