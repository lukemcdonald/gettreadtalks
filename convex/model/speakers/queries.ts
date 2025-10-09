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
 * Get speakers.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of speakers
 */
export async function getSpeakers(ctx: QueryCtx, args: ListSpeakersArgs) {
  const { limit = 100 } = args;

  return await ctx.db.query('speakers').take(limit);
}
