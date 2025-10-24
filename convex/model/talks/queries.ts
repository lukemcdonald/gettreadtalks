import type { Doc } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';

import { v } from 'convex/values';
import { asyncMap } from 'convex-helpers';
import { getManyFrom, getManyVia, getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { doc, docs } from '../../lib/validators/schema';
import { statusType } from './validators';

/**
 * Get talk by ID.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Talk or null if not found
 */
export const getTalk = query({
  args: {
    id: v.id('talks'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
  returns: doc('talks', true),
});

/**
 * Get talk by slug.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Talk or null if not found
 */
export const getTalkBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await getOneFrom(ctx.db, 'talks', 'by_slug', args.slug);
  },
  returns: doc('talks', true),
});

/**
 * Get talks with optional filters and pagination.
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated talks
 */
export const getTalks = query({
  args: {
    paginationOpts: v.any(),
    status: v.optional(statusType),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, status } = args;

    if (status) {
      return await ctx.db
        .query('talks')
        .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
        .order('desc')
        .paginate(paginationOpts);
    }

    return await ctx.db.query('talks').order('desc').paginate(paginationOpts);
  },
  returns: v.any(), // PaginationResult<Doc<'talks'>>
});

/**
 * Get talks with speaker data (paginated).
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated talks with speaker information
 */
export const getTalksWithSpeakers = query({
  args: {
    paginationOpts: v.any(), // PaginationOptions
    status: v.optional(statusType),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, status } = args;

    let result;
    if (status) {
      result = await ctx.db
        .query('talks')
        .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
        .order('desc')
        .paginate(paginationOpts);
    } else {
      result = await ctx.db.query('talks').order('desc').paginate(paginationOpts);
    }

    const enrichedPage = await asyncMap(result.page, async (talk: Doc<'talks'>) => {
      const speaker = await ctx.db.get(talk.speakerId);
      return { ...talk, speaker };
    });

    return {
      ...result,
      page: enrichedPage,
    };
  },
  returns: v.any(), // PaginationResult with enriched data
});

/**
 * Get talk by slug with related data.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Talk with speaker, collection, clips, and topics data
 */
export const getTalkBySlugWithRelations = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const talk = await getOneFrom(ctx.db, 'talks', 'by_slug', args.slug);

    if (!talk) {
      return null;
    }

    const queries = {
      clips: ctx.db
        .query('clips')
        .withIndex('by_talkId_and_status', (q) =>
          q.eq('talkId', talk._id).eq('status', 'published'),
        )
        .collect(),
      collection: talk.collectionId ? ctx.db.get(talk.collectionId) : null,
      speaker: talk.speakerId ? ctx.db.get(talk.speakerId) : null,
      topics: getManyVia(ctx.db, 'talksOnTopics', 'topicId', 'by_talkId', talk._id, 'talkId'),
    };

    const [clips, collection, speaker, topics] = await Promise.all([
      queries.clips,
      queries.collection,
      queries.speaker,
      queries.topics,
    ]);

    // Filter out any null topics
    const validTopics = topics.filter((topic) => topic !== null);

    return {
      clips,
      collection,
      speaker,
      talk,
      topics: validTopics,
    };
  },
  returns: v.union(
    v.object({
      clips: docs('clips'),
      collection: doc('collections', true),
      speaker: doc('speakers', true),
      talk: doc('talks'),
      topics: docs('topics'),
    }),
    v.null(),
  ),
});

/**
 * Get talks by speaker with status filter.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of talks
 */
export const getTalksBySpeaker = query({
  args: {
    limit: v.optional(v.number()),
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    const { limit = 20, speakerId } = args;

    return await ctx.db
      .query('talks')
      .withIndex('by_speakerId_and_status', (q) =>
        q.eq('speakerId', speakerId).eq('status', 'published'),
      )
      .order('desc')
      .take(limit);
  },
  returns: docs('talks'),
});

/**
 * Get talks by collection with status filter.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of talks sorted by collection order
 */
export const getTalksByCollection = query({
  args: {
    collectionId: v.id('collections'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { collectionId, limit = 100 } = args;

    const talks = await ctx.db
      .query('talks')
      .withIndex('by_collectionId_and_status', (q) =>
        q.eq('collectionId', collectionId).eq('status', 'published'),
      )
      .take(limit);

    // Sort by collection order.
    const sortedTalks = talks.sort((a, b) => (a.collectionOrder || 0) - (b.collectionOrder || 0));

    return sortedTalks;
  },
  returns: docs('talks'),
});

/**
 * Get featured talks (random selection).
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of random featured talks
 */
export const listFeaturedTalks = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 5 } = args;

    // Intentionally unbounded: Need all featured talks for random selection
    // Limited to 50 to prevent memory issues if featured talks grow
    const talks = await ctx.db
      .query('talks')
      .withIndex('by_featured_and_status', (q) => q.eq('featured', true).eq('status', 'published'))
      .take(50);

    // Shuffle and return limited number
    const shuffled = talks.sort(() => Math.random() - 0.5);

    return shuffled.slice(0, limit);
  },
  returns: docs('talks'),
});

/**
 * Get random talks by speaker (excluding a specific talk).
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Array of random talks by speaker
 */
export const getRandomTalksBySpeaker = query({
  args: {
    excludeTalkId: v.optional(v.string()),
    limit: v.optional(v.number()),
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    const { excludeTalkId, limit = 5, speakerId } = args;

    const talks = await ctx.db
      .query('talks')
      .withIndex('by_speakerId_and_status', (q) =>
        q.eq('speakerId', speakerId).eq('status', 'published'),
      )
      .collect();

    // Filter out excluded talk if provided
    const filteredTalks = excludeTalkId
      ? talks.filter((talk) => talk._id !== excludeTalkId)
      : talks;

    // Shuffle and return limited number
    const shuffled = filteredTalks.sort(() => Math.random() - 0.5);

    return shuffled.slice(0, limit);
  },
  returns: docs('talks'),
});

/**
 * Get total count of published talks.
 *
 * @param ctx - Database context
 * @returns Count of published talks
 */
export const getTalksCount = query({
  args: {},
  handler: async (ctx) => {
    const talks = await getManyFrom(
      ctx.db,
      'talks',
      'by_status_and_publishedAt',
      'published',
      'status',
    );

    return talks.length;
  },
  returns: v.number(),
});
