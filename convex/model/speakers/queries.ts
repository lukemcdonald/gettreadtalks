import type { Doc } from '../../_generated/dataModel';

import { paginationOptsValidator, paginationResultValidator } from 'convex/server';
import { v } from 'convex/values';
import { getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { doc, docs } from '../../lib/validators/schema';

const speakerPageValidator = paginationResultValidator(doc('speakers'));

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
  handler: async (ctx, args) => await ctx.db.get(args.id),
  returns: doc('speakers').nullable(),
});

/**
 * Get speaker by slug with related data (default for detail pages).
 * Returns speaker with related talks, collections, and clips.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Speaker with related talks, collections, and clips
 */
export const getSpeakerBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const speaker = await getOneFrom(ctx.db, 'speakers', 'by_slug', args.slug);

    if (!speaker) {
      return null;
    }

    const [talks, collections, clips] = await Promise.all([
      ctx.db
        .query('talks')
        .withIndex('by_speakerId_and_status', (q) =>
          q.eq('speakerId', speaker._id).eq('status', 'published'),
        )
        .order('desc')
        .take(20),
      ctx.db
        .query('talks')
        .withIndex('by_speakerId_and_status', (q) =>
          q.eq('speakerId', speaker._id).eq('status', 'published'),
        )
        .collect()
        .then((allTalks) => {
          const collectionIds = [
            ...new Set(allTalks.flatMap((talk) => (talk.collectionId ? [talk.collectionId] : []))),
          ];
          return Promise.all(collectionIds.map((id) => ctx.db.get(id))).then((cols) =>
            cols.filter((col): col is Doc<'collections'> => col !== null),
          );
        }),
      ctx.db
        .query('clips')
        .withIndex('by_speakerId_and_status', (q) =>
          q.eq('speakerId', speaker._id).eq('status', 'published'),
        )
        .order('desc')
        .take(20),
    ]);

    return {
      clips,
      collections,
      speaker,
      talks,
    };
  },
  returns: v.nullable(
    v.object({
      clips: docs('clips'),
      collections: docs('collections'),
      speaker: doc('speakers'),
      talks: docs('talks'),
    }),
  ),
});

/**
 * List all speakers (for migration/cleanup purposes).
 * Returns all speakers without pagination.
 *
 * @param ctx - Database context
 * @returns All speakers
 */
export const listAllSpeakers = query({
  args: {},
  handler: async (ctx) => await ctx.db.query('speakers').collect(),
  returns: docs('speakers'),
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
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) =>
    await ctx.db
      .query('speakers')
      .withIndex('by_lastName')
      .order('asc')
      .paginate(args.paginationOpts),
  returns: speakerPageValidator,
});
