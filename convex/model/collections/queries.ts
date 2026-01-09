import type { Doc } from '../../_generated/dataModel';

import { paginationOptsValidator, paginationResultValidator } from 'convex/server';
import { v } from 'convex/values';
import { asyncMap } from 'convex-helpers';
import { getAll, getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { filterCollectionsWithPublishedTalks } from '../../lib/filters';
import { enrichWithSpeakers } from '../../lib/utils';
import { talkWithSpeakerValidator } from '../../lib/validators/query';
import { doc, docs } from '../../lib/validators/schema';

const collectionPageValidator = paginationResultValidator(doc('collections'));

/**
 * Get collection by ID.
 */
export const getCollection = query({
  args: {
    id: v.id('collections'),
  },
  handler: async (ctx, args) => await ctx.db.get('collections', args.id),
  returns: doc('collections').nullable(),
});

/**
 * Get collection with its talks.
 */
export const getCollectionWithTalks = query({
  args: {
    id: v.id('collections'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 100, id } = args;

    const collection = await ctx.db.get('collections', id);

    if (!collection) {
      return null;
    }

    const talks = await ctx.db
      .query('talks')
      .withIndex('by_collectionId_and_status', (q) =>
        q.eq('collectionId', collection._id).eq('status', 'published'),
      )
      .take(limit);

    // Sort by collectionOrder
    talks.sort((a, b) => (a.collectionOrder || 0) - (b.collectionOrder || 0));

    return {
      collection,
      talks,
    };
  },
  returns: v.nullable(
    v.object({
      collection: doc('collections'),
      talks: docs('talks'),
    }),
  ),
});

/**
 * Get collection by slug with related data (default for detail pages).
 * Returns collection with its talks (each with speaker).
 */
export const getCollectionBySlug = query({
  args: {
    limit: v.optional(v.number()),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const { limit = 100, slug } = args;

    const collection = await getOneFrom(ctx.db, 'collections', 'by_slug', slug);

    if (!collection) {
      return null;
    }

    const talks = await ctx.db
      .query('talks')
      .withIndex('by_collectionId_and_status', (q) =>
        q.eq('collectionId', collection._id).eq('status', 'published'),
      )
      .take(limit);

    talks.sort((a, b) => (a.collectionOrder || 0) - (b.collectionOrder || 0));

    const talksWithSpeakers = await enrichWithSpeakers(ctx, talks);

    return {
      collection,
      talks: talksWithSpeakers,
    };
  },
  returns: v.nullable(
    v.object({
      collection: doc('collections'),
      talks: v.array(talkWithSpeakerValidator),
    }),
  ),
});

/**
 * Get collection with unique speakers from its talks.
 */
export const getCollectionWithSpeakers = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const collection = await getOneFrom(ctx.db, 'collections', 'by_slug', args.slug);

    if (!collection) {
      return null;
    }

    const talks = await ctx.db
      .query('talks')
      .withIndex('by_collectionId_and_status', (q) =>
        q.eq('collectionId', collection._id).eq('status', 'published'),
      )
      .collect();

    // Get unique speaker IDs
    const speakerIds = [...new Set(talks.map((talk) => talk.speakerId))];

    // Fetch all speakers in parallel
    const speakers = await getAll(ctx.db, speakerIds);

    // Filter out null speakers
    const validSpeakers = speakers.filter((speaker) => speaker !== null);

    return {
      collection,
      speakers: validSpeakers,
    };
  },
  returns: v.nullable(
    v.object({
      collection: doc('collections'),
      speakers: docs('speakers'),
    }),
  ),
});

/**
 * List collections with pagination.
 */
export const listCollections = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) =>
    await ctx.db.query('collections').order('desc').paginate(args.paginationOpts),
  returns: collectionPageValidator,
});

/**
 * List collections by speaker. Returns collections that contain talks by the speaker.
 */
export const listCollectionsBySpeaker = query({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    // Get all published talks by speaker
    const talks = await ctx.db
      .query('talks')
      .withIndex('by_speakerId_and_status', (q) =>
        q.eq('speakerId', args.speakerId).eq('status', 'published'),
      )
      .collect();

    // Get unique collection IDs (filter out talks without collections)
    const collectionIds = [
      ...new Set(talks.flatMap((talk) => (talk.collectionId ? [talk.collectionId] : []))),
    ];

    // Fetch all collections in parallel
    const collections = await getAll(ctx.db, collectionIds);

    // Filter out null collections
    const validCollections = collections.filter((collection) => collection !== null);

    return validCollections;
  },
  returns: docs('collections'),
});

/**
 * List collections with stats (talk counts and speakers, public-facing).
 * Filters to only collections with published talks.
 */
export const listCollectionsWithStats = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.query('collections').order('desc').paginate(args.paginationOpts);

    const filtered = await filterCollectionsWithPublishedTalks(ctx, result.page);

    // Enrich each collection with stats
    const enrichedPage = await asyncMap(filtered, async (collection: Doc<'collections'>) => {
      const talks = await ctx.db
        .query('talks')
        .withIndex('by_collectionId_and_status', (q) =>
          q.eq('collectionId', collection._id).eq('status', 'published'),
        )
        .collect();

      // Get unique speaker IDs
      const speakerIds = [...new Set(talks.map((talk) => talk.speakerId))];

      // Fetch speakers in parallel
      const speakers = await getAll(ctx.db, speakerIds);
      const validSpeakers = speakers.filter((speaker) => speaker !== null);

      return {
        collection,
        speakers: validSpeakers,
        talkCount: talks.length,
      };
    });

    return {
      ...result,
      page: enrichedPage,
    };
  },
  returns: v.any(), // PaginationResult with enriched page: Array<{ collection, speakers, talkCount }>
});

/**
 * List collections with stats (admin).
 * Returns all collections without filtering.
 */
export const listCollectionsAdmin = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.query('collections').order('desc').paginate(args.paginationOpts);

    // Enrich each collection with stats
    const enrichedPage = await asyncMap(result.page, async (collection: Doc<'collections'>) => {
      const talks = await ctx.db
        .query('talks')
        .withIndex('by_collectionId_and_status', (q) =>
          q.eq('collectionId', collection._id).eq('status', 'published'),
        )
        .collect();

      // Get unique speaker IDs
      const speakerIds = [...new Set(talks.map((talk) => talk.speakerId))];

      // Fetch speakers in parallel
      const speakers = await getAll(ctx.db, speakerIds);
      const validSpeakers = speakers.filter((speaker) => speaker !== null);

      return {
        collection,
        speakers: validSpeakers,
        talkCount: talks.length,
      };
    });

    return {
      ...result,
      page: enrichedPage,
    };
  },
  returns: v.any(), // PaginationResult with enriched page: Array<{ collection, speakers, talkCount }>
});
