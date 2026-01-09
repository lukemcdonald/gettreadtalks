import type { PaginationResult } from 'convex/server';
import type { Doc } from '../../_generated/dataModel';

import { paginationOptsValidator, paginationResultValidator } from 'convex/server';
import { v } from 'convex/values';
import { asyncMap } from 'convex-helpers';
import { getManyFrom, getManyVia, getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { paginateArray, shuffleAndLimit } from '../../lib/utils';
import { talkWithSpeakerValidator } from '../../lib/validators/query';
import { doc, docs } from '../../lib/validators/schema';
import { canViewContent } from '../auth/roles';
import { getCurrentUser } from '../auth/utils';
import { applySearchFilter, enrichWithSpeakers, enrichWithTopics, getTalksByTopic } from './utils';
import { statusType } from './validators';

const talkPageValidator = paginationResultValidator(doc('talks'));
const talkPageWithSpeakersValidator = paginationResultValidator(talkWithSpeakerValidator);

/**
 * Get talk by ID.
 */
export const getTalk = query({
  args: {
    id: v.id('talks'),
  },
  handler: async (ctx, args) => await ctx.db.get('talks', args.id),
  returns: doc('talks').nullable(),
});

/**
 * Get talk by speaker slug and talk slug with related data (default for detail pages).
 * Returns talk with speaker, collection, clips, and topics.
 */
export const getTalkBySlug = query({
  args: {
    speakerSlug: v.string(),
    talkSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    // First, get the speaker by slug
    const speaker = await getOneFrom(ctx.db, 'speakers', 'by_slug', args.speakerSlug);

    if (!speaker) {
      return null;
    }

    // Then, find the talk with the given slug for this speaker
    const talks = await ctx.db
      .query('talks')
      .withIndex('by_speakerId_and_status', (q) => q.eq('speakerId', speaker._id))
      .collect();

    const talk = talks.find((t) => t.slug === args.talkSlug);

    if (!talk) {
      return null;
    }

    if (!canViewContent(user, talk.status)) {
      return null;
    }

    const queries = {
      clips: ctx.db
        .query('clips')
        .withIndex('by_talkId_and_status', (q) =>
          q.eq('talkId', talk._id).eq('status', 'published'),
        )
        .collect(),
      collection: talk.collectionId ? ctx.db.get('collections', talk.collectionId) : null,
      topics: getManyVia(ctx.db, 'talksOnTopics', 'topicId', 'by_talkId', talk._id, 'talkId'),
    };

    const [clips, collection, topics] = await Promise.all([
      queries.clips,
      queries.collection,
      queries.topics,
    ]);

    const validTopics = topics.filter((topic) => topic !== null);

    return {
      clips,
      collection,
      speaker,
      talk,
      topics: validTopics,
    };
  },
  returns: v.nullable(
    v.object({
      clips: docs('clips'),
      collection: doc('collections').nullable(),
      speaker: doc('speakers').nullable(),
      talk: doc('talks'),
      topics: docs('topics'),
    }),
  ),
});

/**
 * Get total count of published talks.
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

    return shuffleAndLimit(talks, limit);
  },
  returns: docs('talks'),
});

/**
 * Get featured talks with speaker data.
 */
export const listFeaturedTalksWithSpeakers = query({
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

    const page = shuffleAndLimit(talks, limit);

    return await enrichWithSpeakers(ctx, page);
  },
  returns: v.array(talkWithSpeakerValidator),
});

/**
 * Get random talks by speaker (excluding a specific talk).
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

    return shuffleAndLimit(filteredTalks, limit);
  },
  returns: docs('talks'),
});

/**
 * List talks with optional filters and pagination.
 */
export const listTalks = query({
  args: {
    featured: v.optional(v.boolean()),
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    speakerId: v.optional(v.id('speakers')),
    status: v.optional(statusType),
    topicId: v.optional(v.id('topics')),
  },
  // biome-ignore lint/complexity: query
  handler: async (ctx, args) => {
    const { featured, paginationOpts, search, speakerId, status, topicId } = args;

    // If filtering by topic, get talks from talksOnTopics join table
    if (topicId) {
      const talksOnTopics = await ctx.db
        .query('talksOnTopics')
        .withIndex('by_topicId', (q) => q.eq('topicId', topicId))
        .collect();

      const talkIds = talksOnTopics.map((t) => t.talkId);
      const talks = await Promise.all(talkIds.map((id) => ctx.db.get('talks', id)));

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

      if (search) {
        const searchLower = search.toLowerCase();
        filteredTalks = filteredTalks.filter((talk) =>
          talk.title.toLowerCase().includes(searchLower),
        );
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
      const result = await ctx.db
        .query('talks')
        .withIndex('by_featured_and_status', (q) => q.eq('featured', featured).eq('status', status))
        .order('desc')
        .paginate(paginationOpts);

      if (search) {
        result.page = applySearchFilter(result.page, search);
        // Reset pagination when search is applied (simplified approach)
        return {
          continueCursor: '',
          isDone: true,
          page: result.page,
        };
      }

      return result;
    }

    if (speakerId && status) {
      const result = await ctx.db
        .query('talks')
        .withIndex('by_speakerId_and_status', (q) =>
          q.eq('speakerId', speakerId).eq('status', status),
        )
        .order('desc')
        .paginate(paginationOpts);

      if (search) {
        result.page = applySearchFilter(result.page, search);
        return {
          continueCursor: '',
          isDone: true,
          page: result.page,
        };
      }

      return result;
    }

    if (status) {
      const result = await ctx.db
        .query('talks')
        .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
        .order('desc')
        .paginate(paginationOpts);

      if (search) {
        result.page = applySearchFilter(result.page, search);
        return {
          continueCursor: '',
          isDone: true,
          page: result.page,
        };
      }

      return result;
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

      if (search) {
        result.page = applySearchFilter(result.page, search);
        return {
          continueCursor: '',
          isDone: true,
          page: result.page,
        };
      }

      return result;
    }

    if (featured !== undefined) {
      const result = await ctx.db
        .query('talks')
        .withIndex('by_featured_and_status', (q) => q.eq('featured', featured))
        .order('desc')
        .paginate(paginationOpts);

      if (search) {
        result.page = applySearchFilter(result.page, search);
        return {
          continueCursor: '',
          isDone: true,
          page: result.page,
        };
      }

      return result;
    }

    // Default query - apply search if provided
    if (search) {
      // For search without other filters, we need to fetch all and filter
      // This is less efficient but necessary for search functionality
      const allTalks = await ctx.db.query('talks').order('desc').collect();
      const filtered = applySearchFilter(allTalks, search);
      const numItems = paginationOpts.numItems || 20;
      const page = filtered.slice(0, numItems);

      return {
        continueCursor: '',
        isDone: filtered.length <= numItems,
        page,
      };
    }

    return await ctx.db.query('talks').order('desc').paginate(paginationOpts);
  },
  returns: talkPageValidator,
});

/**
 * Get talks by collection with status filter. Returns talks sorted by collection order.
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
 * Get talks with speaker data with pagination support.
 *
 * For public pages: Always pass status='published'
 * For admin pages: Pass appropriate status or omit for default 'published'
 *
 * @param status - Filter by status (defaults to 'published')
 * @param paginationOpts - Pagination options
 */
export const listTalksWithSpeakers = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(statusType),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, status = 'published' } = args;

    const result = await ctx.db
      .query('talks')
      .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
      .order('desc')
      .paginate(paginationOpts);

    const talksWithSpeakers = await enrichWithSpeakers(ctx, result.page);
    const enrichedTalks = await enrichWithTopics(ctx, talksWithSpeakers);

    return {
      ...result,
      page: enrichedTalks,
    };
  },
  returns: paginationResultValidator(
    talkWithSpeakerValidator.extend({
      topicSlugs: v.array(v.string()),
    }),
  ),
});

/**
 * Admin-specific query for talks with speakers that supports pagination and server-side filtering.
 * Supports status='all' to fetch talks across all statuses.
 *
 * @param status - Filter by status or 'all' for all statuses (defaults to 'published')
 * @param search - Search by title (optional)
 * @param paginationOpts - Pagination options
 */
export const listTalksWithSpeakersAdmin = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    status: v.optional(v.union(statusType, v.literal('all'))),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, search, status = 'published' } = args;

    let talks: Doc<'talks'>[];

    if (status === 'all') {
      talks = await ctx.db.query('talks').order('desc').collect();
    } else {
      talks = await ctx.db
        .query('talks')
        .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
        .order('desc')
        .collect();
    }

    if (search) {
      talks = applySearchFilter(talks, search);
    }

    const { continueCursor, isDone, page } = paginateArray(
      talks,
      paginationOpts.cursor,
      paginationOpts.numItems,
    );

    const enrichedPage = await asyncMap(page, async (talk) => {
      const speaker = await ctx.db.get('speakers', talk.speakerId);

      const talksOnTopics = await ctx.db
        .query('talksOnTopics')
        .withIndex('by_talkId', (q) => q.eq('talkId', talk._id))
        .collect();

      const topics = await Promise.all(talksOnTopics.map((t) => ctx.db.get('topics', t.topicId)));

      const validTopics = topics.filter((topic): topic is Doc<'topics'> => topic !== null);
      const topicSlugs = validTopics.map((topic) => topic.slug);

      return {
        ...talk,
        speaker,
        topicSlugs,
      };
    });

    return {
      continueCursor,
      isDone,
      page: enrichedPage,
    };
  },
  returns: paginationResultValidator(
    v.object({
      ...doc('talks').fields,
      speaker: doc('speakers').nullable(),
      topicSlugs: v.array(v.string()),
    }),
  ),
});
