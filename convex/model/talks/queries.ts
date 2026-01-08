import type { PaginationResult } from 'convex/server';
import type { Doc } from '../../_generated/dataModel';

import { paginationOptsValidator, paginationResultValidator } from 'convex/server';
import { v } from 'convex/values';
import { asyncMap } from 'convex-helpers';
import { getManyFrom, getManyVia, getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { talkWithSpeakerValidator } from '../../lib/validators/query';
import { doc, docs } from '../../lib/validators/schema';
import { canViewContent } from '../auth/roles';
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

    const speaker = await getOneFrom(ctx.db, 'speakers', 'by_slug', args.speakerSlug);

    if (!speaker) {
      return null;
    }

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

    // Shuffle and return limited number
    const shuffled = talks.sort(() => Math.random() - 0.5);

    return shuffled.slice(0, limit);
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

    // Shuffle and return limited number
    const shuffled = talks.sort(() => Math.random() - 0.5);
    const page = shuffled.slice(0, limit);

    const enrichedPage = await asyncMap(page, async (talk: Doc<'talks'>) => {
      const speaker = await ctx.db.get('speakers', talk.speakerId);
      return { ...talk, speaker };
    });

    return enrichedPage;
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

    const filteredTalks = excludeTalkId
      ? talks.filter((talk) => talk._id !== excludeTalkId)
      : talks;

    const shuffled = filteredTalks.sort(() => Math.random() - 0.5);

    return shuffled.slice(0, limit);
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

    if (topicId) {
      const talksOnTopics = await ctx.db
        .query('talksOnTopics')
        .withIndex('by_topicId', (q) => q.eq('topicId', topicId))
        .collect();

      const talkIds = talksOnTopics.map((t) => t.talkId);
      const talks = await Promise.all(talkIds.map((id) => ctx.db.get('talks', id)));

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

      filteredTalks.sort(
        (a, b) => (b.publishedAt || b._creationTime) - (a.publishedAt || a._creationTime),
      );

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

      // Apply speakerId filter if needed (after fetching, since index doesn't include it)
      let filteredPage = result.page;
      if (speakerId) {
        filteredPage = filteredPage.filter((talk) => talk.speakerId === speakerId);
      }

      if (search) {
        filteredPage = applySearchFilter(filteredPage, search);
        // Reset pagination when search is applied (simplified approach)
        return {
          continueCursor: '',
          isDone: true,
          page: filteredPage,
        };
      }

      return {
        ...result,
        page: filteredPage,
      };
    }

    if (speakerId && status) {
      const result = await ctx.db
        .query('talks')
        .withIndex('by_speakerId_and_status', (q) =>
          q.eq('speakerId', speakerId).eq('status', status),
        )
        .order('desc')
        .paginate(paginationOpts);

      // Apply featured filter if needed (after fetching, since index doesn't include it)
      let filteredPage = result.page;
      if (featured !== undefined) {
        filteredPage = filteredPage.filter((talk) => talk.featured === featured);
      }

      if (search) {
        filteredPage = applySearchFilter(filteredPage, search);
        return {
          continueCursor: '',
          isDone: true,
          page: filteredPage,
        };
      }

      return {
        ...result,
        page: filteredPage,
      };
    }

    if (status) {
      const result = await ctx.db
        .query('talks')
        .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
        .order('desc')
        .paginate(paginationOpts);

      // Apply speakerId filter if needed (after fetching, since index doesn't include it)
      let filteredPage = result.page;
      if (speakerId) {
        filteredPage = filteredPage.filter((talk) => talk.speakerId === speakerId);
      }

      // Apply featured filter if needed (after fetching, since index doesn't include it)
      if (featured !== undefined) {
        filteredPage = filteredPage.filter((talk) => talk.featured === featured);
      }

      if (search) {
        filteredPage = applySearchFilter(filteredPage, search);
        return {
          continueCursor: '',
          isDone: true,
          page: filteredPage,
        };
      }

      return {
        ...result,
        page: filteredPage,
      };
    }

    if (speakerId) {
      // When speakerId is provided without status, default to 'published' for public access
      // This ensures users only see published talks when filtering by speaker
      const effectiveStatus = status || 'published';
      const result = await ctx.db
        .query('talks')
        .withIndex('by_speakerId_and_status', (q) =>
          q.eq('speakerId', speakerId).eq('status', effectiveStatus),
        )
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
 * Get talks with speaker data (paginated). Supports all the same filters as listTalks.
 */
/**
 * List talks with speakers, with optional server-side filtering and pagination.
 * Filters: search, speaker, topic, featured, status
 * Much simpler than previous implementation - uses single index and TypeScript filtering.
 */
export const listTalksWithSpeakers = query({
  args: {
    featured: v.optional(v.boolean()),
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    speakerId: v.optional(v.id('speakers')),
    status: v.optional(v.union(statusType, v.literal('all'))),
    topicId: v.optional(v.id('topics')),
  },
  handler: async (ctx, args) => {
    const { featured, paginationOpts, search, speakerId, status, topicId } = args;

    // Fetch talks based on status
    let talks: Doc<'talks'>[];

    if (status === 'all') {
      // Fetch all talks across all statuses, ordered by creation time (newest first)
      talks = await ctx.db.query('talks').order('desc').collect();
    } else {
      // Default to 'published' if no status provided
      const effectiveStatus = status || 'published';

      // Fetch all talks for the specific status (using index for efficiency)
      talks = await ctx.db
        .query('talks')
        .withIndex('by_status_and_publishedAt', (q) => q.eq('status', effectiveStatus))
        .order('desc')
        .collect();
    }

    if (speakerId) {
      talks = talks.filter((talk) => talk.speakerId === speakerId);
    }

    if (featured !== undefined) {
      talks = talks.filter((talk) => talk.featured === featured);
    }

    // Requires checking join table
    if (topicId) {
      const talksOnTopics = await ctx.db
        .query('talksOnTopics')
        .withIndex('by_topicId', (q) => q.eq('topicId', topicId))
        .collect();
      const talkIdsWithTopic = new Set(talksOnTopics.map((t) => t.talkId));
      talks = talks.filter((talk) => talkIdsWithTopic.has(talk._id));
    }

    // Search by title AND speaker name
    if (search) {
      const searchLower = search.toLowerCase();

      const speakerIds = [...new Set(talks.map((talk) => talk.speakerId))];
      const speakers = await Promise.all(speakerIds.map((id) => ctx.db.get('speakers', id)));
      const speakersMap = new Map(
        speakers.filter((s): s is NonNullable<typeof s> => s !== null).map((s) => [s._id, s]),
      );

      talks = talks.filter((talk) => {
        if (talk.title.toLowerCase().includes(searchLower)) {
          return true;
        }

        const speaker = speakersMap.get(talk.speakerId);
        if (speaker) {
          const speakerName = `${speaker.firstName} ${speaker.lastName}`.toLowerCase();
          if (speakerName.includes(searchLower)) {
            return true;
          }
        }

        return false;
      });
    }

    const startIndex = paginationOpts.cursor ? Number.parseInt(paginationOpts.cursor, 10) : 0;
    const endIndex = startIndex + paginationOpts.numItems;
    const page = talks.slice(startIndex, endIndex);
    const hasMore = endIndex < talks.length;

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
      continueCursor: hasMore ? endIndex.toString() : '',
      isDone: !hasMore,
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
