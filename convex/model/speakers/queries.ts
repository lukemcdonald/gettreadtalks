import type { Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';

/**
 * Get speaker by ID.
 *
 * @param ctx - Database context
 * @param id - Speaker ID
 * @returns Speaker or null if not found
 */
export async function getSpeaker(ctx: QueryCtx, id: Id<'speakers'>) {
  return await ctx.db.get(id);
}

/**
 * Get speaker by slug.
 *
 * @param ctx - Database context
 * @param slug - Speaker slug
 * @returns Speaker or null if not found
 */
export async function getSpeakerBySlug(ctx: QueryCtx, slug: string) {
  return await ctx.db
    .query('speakers')
    .withIndex('by_slug', (q) => q.eq('slug', slug))
    .unique();
}

/**
 * Get speakers.
 *
 * @param ctx - Database context
 * @param limit - Maximum number of results
 * @returns Array of speakers
 */
export async function getSpeakers(ctx: QueryCtx, limit: number = 100) {
  return await ctx.db.query('speakers').take(limit);
}
