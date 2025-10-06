import type { QueryCtx } from '../_generated/server';

/**
 * Get speaker by slug
 * @param ctx - Database context
 * @param slug - Speaker slug
 * @returns Speaker or null if not found
 */
export async function getBySlug(ctx: QueryCtx, slug: string) {
  return await ctx.db
    .query('speakers')
    .withIndex('by_slug', (q) => q.eq('slug', slug))
    .unique();
}
