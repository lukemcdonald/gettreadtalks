import { v } from 'convex/values';
import { getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { doc, docs } from '../../lib/validators/schema';

/**
 * Get speaker by ID.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Speaker or null if not found
 */
export const getSpeaker = query({
  args: {
    id: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
  returns: doc('speakers', true),
});

/**
 * Get speaker by slug.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Speaker or null if not found
 */
export const getSpeakerBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await getOneFrom(ctx.db, 'speakers', 'by_slug', args.slug);
  },
  returns: doc('speakers', true),
});

/**
 * Get total count of speakers.
 *
 * @param ctx - Database context
 * @returns Count of speakers
 */
export const getSpeakersCount = query({
  args: {},
  handler: async (ctx) => {
    const speakers = await ctx.db.query('speakers').collect();

    return speakers.length;
  },
  returns: v.number(),
});

/**
 * Get featured speakers (random selection).
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of random featured speakers
 */
export const listFeaturedSpeakers = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 6 } = args;

    // Intentionally unbounded: Need all featured speakers for random selection
    // Limited to 50 to prevent memory issues if featured speakers grow
    const speakers = await ctx.db
      .query('speakers')
      .withIndex('by_featured', (q) => q.eq('featured', true))
      .take(50);

    // Shuffle and return limited number
    const shuffled = speakers.sort(() => Math.random() - 0.5);

    return shuffled.slice(0, limit);
  },
  returns: docs('speakers'),
});

/**
 * List speakers with pagination.
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated speakers
 */
export const listSpeakers = query({
  args: {
    paginationOpts: v.any(), // PaginationOptions
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('speakers')
      .withIndex('by_lastName')
      .order('asc')
      .paginate(args.paginationOpts);
  },
  returns: v.any(), // PaginationResult<Doc<'speakers'>>
});
