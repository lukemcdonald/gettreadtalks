import type { Doc } from '../../_generated/dataModel';

import { v } from 'convex/values';
import { asyncMap } from 'convex-helpers';
import { getAll, getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { doc, docs } from '../../lib/validators/schema';

/**
 * Get collection by ID.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Collection or null if not found
 */
export const getCollection = query({
  args: {
    id: v.id('collections'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
  returns: doc('collections', true),
});

/**
 * Get collection by slug.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Collection or null if not found
 */
export const getCollectionBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await getOneFrom(ctx.db, 'collections', 'by_slug', args.slug);
  },
  returns: doc('collections', true),
});

/**
 * Get collections with pagination.
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated collections
 */
export const getCollections = query({
  args: {
    paginationOpts: v.any(), // PaginationOptions
  },
  handler: async (ctx, args) => {
    return await ctx.db.query('collections').order('desc').paginate(args.paginationOpts);
  },
  returns: v.any(), // PaginationResult<Doc<'collections'>>
});

/**
 * Get collections with stats (talk counts and speakers).
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated collections with talk counts and speakers
 */
export const getCollectionsWithStats = query({
  args: {
    paginationOpts: v.any(), // PaginationOptions
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
  returns: v.any(), // PaginationResult with enriched data
});

/**
 * Get collection with its talks.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Collection with its talks
 */
export const getCollectionWithTalks = query({
  args: {
    id: v.id('collections'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 100, id } = args;

    const collection = await ctx.db.get(id);

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
  returns: v.union(
    v.object({
      collection: doc('collections'),
      talks: docs('talks'),
    }),
    v.null(),
  ),
});

/**
 * Get collection with unique speakers from its talks.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Collection with array of unique speakers
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
  returns: v.union(
    v.object({
      collection: doc('collections'),
      speakers: docs('speakers'),
    }),
    v.null(),
  ),
});

/**
 * Get collections by speaker.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Array of collections that contain talks by the speaker
 */
export const getCollectionsBySpeaker = query({
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
      ...new Set(talks.filter((talk) => talk.collectionId).map((talk) => talk.collectionId!)),
    ];

    // Fetch all collections in parallel
    const collections = await getAll(ctx.db, collectionIds);

    // Filter out null collections
    const validCollections = collections.filter((collection) => collection !== null);

    return validCollections;
  },
  returns: docs('collections'),
});
