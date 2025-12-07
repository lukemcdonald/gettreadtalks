import type { PaginationResult } from 'convex/server';
import type { Doc } from '../../_generated/dataModel';

import { paginationOptsValidator, paginationResultValidator } from 'convex/server';
import { v } from 'convex/values';
import { asyncMap } from 'convex-helpers';
import { getManyFrom, getManyVia, getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { talkWithSpeakerValidator } from '../../lib/validators/query';
import { doc, docs } from '../../lib/validators/schema';
import { getCurrentUser } from '../auth/utils';
import {
  applyAdditionalFilters,
  applySearchFilter,
  enrichWithSpeakers,
  getTalksByTopic,
} from './utils';
import { statusType } from './validators';

const talkPageValidator = paginationResultValidator(doc('talks'));
const talkPageWithSpeakersValidator = paginationResultValidator(talkWithSpeakerValidator);

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
  returns: doc('talks').nullable(),
});

/**
 * Get talk by speaker slug and talk slug with related data (default for detail pages).
 * Returns talk with speaker, collection, clips, and topics.
 *
 * @param ctx - Database context
 * @param args - Query arguments with speakerSlug and talkSlug
 * @returns Talk with speaker, collection, clips, and topics data
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
 * Get featured talks with speaker data.
 *
 * @param ctx - Database context
 * @param args - Query arguments with limit
 * @returns Array of featured talks with speaker information
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

    // Shuffle and return limited number
    const shuffled = talks.sort(() => Math.random() - 0.5);
    const page = shuffled.slice(0, limit);

    const enrichedPage = await asyncMap(page, async (talk: Doc<'talks'>) => {
      const speaker = await ctx.db.get(talk.speakerId);
      return { ...talk, speaker };
    });

    return enrichedPage;
  },
  returns: v.array(talkWithSpeakerValidator),
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
 * Supports all the same filters as listTalks.
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options and filters
 * @returns Paginated talks with speaker information
 */
export const listTalksWithSpeakers = query({
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
    // Note: Topic filtering requires collecting all matching talks and filtering in TypeScript,
    // so we opt out of .paginate() and return a single manually paginated page
    if (topicId) {
      const talks = await getTalksByTopic(ctx, topicId);
      let filteredTalks = applyAdditionalFilters(talks, { featured, speakerId, status });
      filteredTalks = applySearchFilter(filteredTalks, search);

      // Sort by publishedAt or _creationTime
      filteredTalks.sort(
        (a, b) => (b.publishedAt || b._creationTime) - (a.publishedAt || a._creationTime),
      );

      // Manual pagination (opted out of .paginate() due to TypeScript filtering)
      const numItems = paginationOpts.numItems || 20;
      const page = filteredTalks.slice(0, numItems);

      const enrichedPage = await enrichWithSpeakers(ctx, page);

      return {
        continueCursor: '',
        isDone: true,
        page: enrichedPage,
      };
    }

    let result: PaginationResult<Doc<'talks'>>;

    // Use indexes when possible for better performance
    // When search is present, we apply it after pagination and opt out of .paginate()
    // to return a single page (simplified approach for complex filters)
    if (featured !== undefined && status) {
      result = await ctx.db
        .query('talks')
        .withIndex('by_featured_and_status', (q) => q.eq('featured', featured).eq('status', status))
        .order('desc')
        .paginate(paginationOpts);

      if (search) {
        result.page = applySearchFilter(result.page, search);
        // Opt out of pagination: search filtering requires TypeScript filtering
        result = {
          continueCursor: '',
          isDone: true,
          page: result.page,
        };
      }
    } else if (speakerId && status) {
      result = await ctx.db
        .query('talks')
        .withIndex('by_speakerId_and_status', (q) =>
          q.eq('speakerId', speakerId).eq('status', status),
        )
        .order('desc')
        .paginate(paginationOpts);

      if (search) {
        result.page = applySearchFilter(result.page, search);
        // Opt out of pagination: search filtering requires TypeScript filtering
        result = {
          continueCursor: '',
          isDone: true,
          page: result.page,
        };
      }
    } else if (status) {
      result = await ctx.db
        .query('talks')
        .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
        .order('desc')
        .paginate(paginationOpts);

      if (search) {
        result.page = applySearchFilter(result.page, search);
        // Opt out of pagination: search filtering requires TypeScript filtering
        result = {
          continueCursor: '',
          isDone: true,
          page: result.page,
        };
      }
    } else if (speakerId) {
      result = await ctx.db
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
        // Opt out of pagination: search filtering requires TypeScript filtering
        result = {
          continueCursor: '',
          isDone: true,
          page: result.page,
        };
      }
    } else if (featured !== undefined) {
      result = await ctx.db
        .query('talks')
        .withIndex('by_featured_and_status', (q) => q.eq('featured', featured))
        .order('desc')
        .paginate(paginationOpts);

      if (search) {
        result.page = applySearchFilter(result.page, search);
        // Opt out of pagination: search filtering requires TypeScript filtering
        result = {
          continueCursor: '',
          isDone: true,
          page: result.page,
        };
      }
    } else if (search) {
      // For search without other filters, we need to fetch all and filter
      // This is less efficient but necessary for search functionality
      // Opt out of .paginate() and use manual pagination
      const allTalks = await ctx.db.query('talks').order('desc').collect();
      const filtered = applySearchFilter(allTalks, search);
      const numItems = paginationOpts.numItems || 20;
      const page = filtered.slice(0, numItems);

      result = {
        continueCursor: '',
        isDone: filtered.length <= numItems,
        page,
      };
    } else {
      // Use .paginate() end-to-end when no complex filters are needed
      result = await ctx.db.query('talks').order('desc').paginate(paginationOpts);
    }

    // Enrich with speakers
    const enrichedPage = await enrichWithSpeakers(ctx, result.page);

    return {
      ...result,
      page: enrichedPage,
    };
  },
  returns: talkPageWithSpeakersValidator,
});
