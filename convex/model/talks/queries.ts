import type { PaginationResult } from 'convex/server';
import type { Doc } from '../../_generated/dataModel';

import { v } from 'convex/values';
import { asyncMap } from 'convex-helpers';
import { getManyFrom, getManyVia, getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { doc, docs } from '../../lib/validators/schema';
import { getCurrentUser } from '../auth/utils';
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
  handler: async (ctx, args) => await ctx.db.get(args.id),
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
  handler: async (ctx, args) => await getOneFrom(ctx.db, 'talks', 'by_slug', args.slug),
  returns: doc('talks', true),
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
    const user = await getCurrentUser(ctx);
    const talk = await getOneFrom(ctx.db, 'talks', 'by_slug', args.slug);

    if (!talk) {
      return null;
    }

    // Unauthenticated users can only view published talks
    if (!user && talk.status !== 'published') {
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
export const listRandomTalksBySpeaker = query({
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
 * List talks with optional filters and pagination.
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated talks
 */
export const listTalks = query({
  args: {
    featured: v.optional(v.boolean()),
    paginationOpts: v.any(),
    speakerId: v.optional(v.id('speakers')),
    status: v.optional(statusType),
    topicId: v.optional(v.id('topics')),
  },
  handler: async (ctx, args) => {
    const { featured, paginationOpts, speakerId, status, topicId } = args;

    // If filtering by topic, get talks from talksOnTopics join table
    if (topicId) {
      const talksOnTopics = await ctx.db
        .query('talksOnTopics')
        .withIndex('by_topicId', (q) => q.eq('topicId', topicId))
        .collect();

      const talkIds = talksOnTopics.map((t) => t.talkId);
      const talks = await Promise.all(talkIds.map((id) => ctx.db.get(id)));

      // Filter out null results and apply additional filters
      let filteredTalks = talks.filter((talk): talk is Doc<'talks'> => talk !== null);

      if (status) {
        filteredTalks = filteredTalks.filter((talk) => talk.status === status);
      }
      if (featured !== undefined) {
        filteredTalks = filteredTalks.filter((talk) => talk.featured === featured);
      }
      if (speakerId) {
        filteredTalks = filteredTalks.filter((talk) => talk.speakerId === speakerId);
      }

      // Sort by publishedAt or _creationTime
      filteredTalks.sort(
        (a, b) => (b.publishedAt || b._creationTime) - (a.publishedAt || a._creationTime),
      );

      // Manual pagination
      const numItems = paginationOpts.numItems || 20;
      const page = filteredTalks.slice(0, numItems);

      return {
        continueCursor: '',
        isDone: true,
        page,
      };
    }

    // Use indexes when possible for better performance
    if (featured !== undefined && status) {
      return await ctx.db
        .query('talks')
        .withIndex('by_featured_and_status', (q) => q.eq('featured', featured).eq('status', status))
        .order('desc')
        .paginate(paginationOpts);
    }

    if (speakerId && status) {
      return await ctx.db
        .query('talks')
        .withIndex('by_speakerId_and_status', (q) =>
          q.eq('speakerId', speakerId).eq('status', status),
        )
        .order('desc')
        .paginate(paginationOpts);
    }

    if (status) {
      return await ctx.db
        .query('talks')
        .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
        .order('desc')
        .paginate(paginationOpts);
    }

    if (speakerId) {
      const result = await ctx.db
        .query('talks')
        .withIndex('by_speakerId_and_status', (q) => q.eq('speakerId', speakerId))
        .order('desc')
        .paginate(paginationOpts);

      // Apply featured filter if needed
      if (featured !== undefined) {
        result.page = result.page.filter((talk) => talk.featured === featured);
      }

      return result;
    }

    if (featured !== undefined) {
      return await ctx.db
        .query('talks')
        .withIndex('by_featured_and_status', (q) => q.eq('featured', featured))
        .order('desc')
        .paginate(paginationOpts);
    }

    return await ctx.db.query('talks').order('desc').paginate(paginationOpts);
  },
  returns: v.any(), // PaginationResult<Doc<'talks'>>
});

/**
 * Get talks by collection with status filter.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of talks sorted by collection order
 */
export const listTalksByCollection = query({
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
 * Get talks by speaker with status filter.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of talks
 */
export const listTalksBySpeaker = query({
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
 * Get talks with speaker data (paginated).
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated talks with speaker information
 */
export const listTalksWithSpeakers = query({
  args: {
    paginationOpts: v.any(), // PaginationOptions
    status: v.optional(statusType),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, status } = args;

    let result: PaginationResult<Doc<'talks'>>;
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
  returns: v.object({
    page: docs('talks'),
    continueCursor: v.string(),
    isDone: v.boolean(),
  }),
});
