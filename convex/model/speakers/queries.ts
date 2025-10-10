import type { PaginationOptions } from 'convex/server';
import type { QueryCtx } from '../../_generated/server';

import type { GetSpeakerArgs, GetSpeakerBySlugArgs, ListSpeakersArgs } from './types';

/**
 * Get speaker by ID.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Speaker or null if not found
 */
export async function getSpeaker(ctx: QueryCtx, args: GetSpeakerArgs) {
  return await ctx.db.get(args.id);
}

/**
 * Get speaker by slug.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Speaker or null if not found
 */
export async function getSpeakerBySlug(ctx: QueryCtx, args: GetSpeakerBySlugArgs) {
  return await ctx.db
    .query('speakers')
    .withIndex('by_slug', (q) => q.eq('slug', args.slug))
    .unique();
}

/**
 * Get speakers with pagination.
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated speakers
 */
export async function getSpeakers(ctx: QueryCtx, args: { paginationOpts: PaginationOptions }) {
  return await ctx.db
    .query('speakers')
    .withIndex('by_last_name')
    .order('asc')
    .paginate(args.paginationOpts);
}

/**
 * Get featured speakers (random selection).
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of random featured speakers
 */
export async function getFeaturedSpeakers(ctx: QueryCtx, args: { limit?: number } = {}) {
  const { limit = 6 } = args;

  const speakers = await ctx.db
    .query('speakers')
    .withIndex('by_featured', (q) => q.eq('featured', true))
    .collect();

  // Shuffle and return limited number
  const shuffled = speakers.sort(() => Math.random() - 0.5);

  return shuffled.slice(0, limit);
}

/**
 * Get total count of speakers.
 *
 * @param ctx - Database context
 * @returns Count of speakers
 */
export async function getSpeakersCount(ctx: QueryCtx) {
  const speakers = await ctx.db.query('speakers').collect();

  return speakers.length;
}
