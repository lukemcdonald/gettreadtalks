import type { Doc } from '../../_generated/dataModel';

import { paginationOptsValidator, paginationResultValidator } from 'convex/server';
import { v } from 'convex/values';
import { getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { filterSpeakersWithPublishedTalks } from '../../lib/filters';
import { shuffleAndLimit } from '../../lib/utils';
import { doc, docs } from '../../lib/validators/schema';

const speakerPageValidator = paginationResultValidator(doc('speakers'));

/**
 * Get speaker by ID.
 */
export const getSpeaker = query({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => await ctx.db.get('speakers', args.speakerId),
  returns: doc('speakers').nullable(),
});

/**
 * Get speaker by slug with related data (default for detail pages).
 * Returns speaker with related talks, collections, and clips.
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

    const { _id: speakerId } = speaker;

    const [talks, clips] = await Promise.all([
      ctx.db
        .query('talks')
        .withIndex('by_speakerId_and_status', (q) =>
          q.eq('speakerId', speakerId).eq('status', 'published'),
        )
        .order('desc')
        .collect(),
      ctx.db
        .query('clips')
        .withIndex('by_speakerId_and_status', (q) =>
          q.eq('speakerId', speakerId).eq('status', 'published'),
        )
        .order('desc')
        .collect(),
    ]);

    const collectionIds = [
      ...new Set(talks.flatMap((talk) => (talk.collectionId ? [talk.collectionId] : []))),
    ];
    const collectionsData = await Promise.all(
      collectionIds.map((id) => ctx.db.get('collections', id)),
    );
    const collections = collectionsData.filter((col): col is Doc<'collections'> => col !== null);

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
 * List all speakers (for migration/cleanup purposes). Returns all speakers without pagination.
 */
export const listAllSpeakers = query({
  args: {},
  handler: async (ctx) => await ctx.db.query('speakers').collect(),
  returns: docs('speakers'),
});

/**
 * Get total count of speakers.
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

    return shuffleAndLimit(speakers, limit);
  },
  returns: docs('speakers'),
});

/**
 * List speakers with pagination (public-facing).
 * Defaults to filtering speakers who have at least one published talk.
 */
export const listSpeakers = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('speakers')
      .withIndex('by_lastName')
      .order('asc')
      .paginate(args.paginationOpts);

    const filtered = await filterSpeakersWithPublishedTalks(ctx, result.page);

    return {
      ...result,
      page: filtered,
    };
  },
  returns: speakerPageValidator,
});

/**
 * List speakers with pagination (admin).
 * Returns all speakers without filtering.
 */
export const listSpeakersAdmin = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const speakerPages = await ctx.db
      .query('speakers')
      .withIndex('by_lastName')
      .order('asc')
      .paginate(args.paginationOpts);

    return speakerPages;
  },
  returns: speakerPageValidator,
});
