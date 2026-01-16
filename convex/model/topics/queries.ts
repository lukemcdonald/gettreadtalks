import type { Doc } from '../../_generated/dataModel';

import { paginationOptsValidator, paginationResultValidator } from 'convex/server';
import { v } from 'convex/values';
import { asyncMap } from 'convex-helpers';
import { getManyFrom, getManyVia, getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { enrichWithSpeakers, paginateArray } from '../../lib/utils';
import { talkWithSpeakerValidator } from '../../lib/validators/query';
import { doc, docs } from '../../lib/validators/schema';

/**
 * Get topic by ID.
 */
export const getTopic = query({
  args: {
    id: v.id('topics'),
  },
  handler: async (ctx, args) => await ctx.db.get('topics', args.id),
  returns: doc('topics').nullable(),
});

/**
 * Get topic with related talks and clips.
 */
export const getTopicWithContent = query({
  args: {
    limit: v.optional(v.number()),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const { limit = 50, slug } = args;

    const topic = await getOneFrom(ctx.db, 'topics', 'by_slug', slug);

    if (!topic) {
      return null;
    }

    const [allClips, allTalks] = await Promise.all([
      getManyVia(ctx.db, 'clipsOnTopics', 'clipId', 'by_topicId', topic._id, 'topicId'),
      getManyVia(ctx.db, 'talksOnTopics', 'talkId', 'by_topicId', topic._id, 'topicId'),
    ]);

    const clips = allClips
      .filter((clip): clip is Doc<'clips'> => clip !== null && clip.status === 'published')
      .slice(0, limit);

    const talks = allTalks
      .filter((talk): talk is Doc<'talks'> => talk !== null && talk.status === 'published')
      .slice(0, limit);

    return {
      clips,
      talks,
      topic,
    };
  },
  returns: v.nullable(
    v.object({
      clips: docs('clips'),
      talks: docs('talks'),
      topic: doc('topics'),
    }),
  ),
});

/**
 * Get topic by slug with related data and pagination support.
 * Returns topic with related talks (each with speaker) and clips.
 */
export const getTopicBySlug = query({
  args: {
    paginationOpts: paginationOptsValidator,
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, slug } = args;

    const topic = await getOneFrom(ctx.db, 'topics', 'by_slug', slug);

    if (!topic) {
      return null;
    }

    const allTalks = await getManyVia(
      ctx.db,
      'talksOnTopics',
      'talkId',
      'by_topicId',
      topic._id,
      'topicId',
    );

    const publishedTalks = allTalks.filter(
      (talk): talk is Doc<'talks'> => talk !== null && talk.status === 'published',
    );

    const { continueCursor, isDone, page } = paginateArray(
      publishedTalks,
      paginationOpts.cursor,
      paginationOpts.numItems,
    );

    const talksWithSpeakers = await enrichWithSpeakers(ctx, page);

    return {
      continueCursor,
      isDone,
      page: talksWithSpeakers,
      topic,
      totalTalks: publishedTalks.length,
    };
  },
  returns: v.nullable(
    v.object({
      continueCursor: v.string(),
      isDone: v.boolean(),
      page: v.array(talkWithSpeakerValidator),
      topic: doc('topics'),
      totalTalks: v.number(),
    }),
  ),
});

/**
 * List topics that have at least one published talk.
 * Returns topics sorted alphabetically by title.
 */
export const listTopics = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 100 } = args;

    const allTopics = await ctx.db.query('topics').withIndex('by_title').take(limit);

    const topicsWithTalks = await asyncMap(allTopics, async (topic) => {
      const talksOnTopics = await getManyFrom(ctx.db, 'talksOnTopics', 'by_topicId', topic._id);
      const talks = await Promise.all(
        talksOnTopics.map((entry) => ctx.db.get('talks', entry.talkId)),
      );

      const publishedTalks = talks.filter(
        (talk): talk is Doc<'talks'> => talk !== null && talk.status === 'published',
      );

      return publishedTalks.length > 0 ? topic : null;
    });

    return topicsWithTalks.filter((topic): topic is Doc<'topics'> => topic !== null);
  },
  returns: docs('topics'),
});

const topicSortType = v.optional(
  v.union(v.literal('alphabetical'), v.literal('least-talks'), v.literal('most-talks')),
);

/**
 * List topics with their published talk counts.
 * Supports filtering by search and sorting.
 * Only returns topics that have at least one published talk.
 */
export const listTopicsWithCount = query({
  args: {
    limit: v.optional(v.number()),
    search: v.optional(v.string()),
    sort: topicSortType,
  },
  handler: async (ctx, args) => {
    const { limit = 100, search, sort = 'alphabetical' } = args;

    const topics = await ctx.db.query('topics').withIndex('by_title').take(limit);

    const topicsWithCounts = await asyncMap(topics, async (topic) => {
      const talksOnTopics = await getManyFrom(ctx.db, 'talksOnTopics', 'by_topicId', topic._id);
      const talks = await Promise.all(
        talksOnTopics.map((entry) => ctx.db.get('talks', entry.talkId)),
      );

      const publishedTalks = talks.filter(
        (talk): talk is Doc<'talks'> => talk !== null && talk.status === 'published',
      );

      return {
        count: publishedTalks.length,
        topic,
      };
    });

    // Filter to topics with at least one published talk
    let results = topicsWithCounts.filter((item) => item.count > 0);

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter((item) => item.topic.title.toLowerCase().includes(searchLower));
    }

    // Apply sorting
    results.sort((a, b) => {
      switch (sort) {
        case 'most-talks':
          return b.count - a.count;
        case 'least-talks':
          return a.count - b.count;
        default:
          return a.topic.title.localeCompare(b.topic.title);
      }
    });

    return results;
  },
  returns: v.array(
    v.object({
      count: v.number(),
      topic: doc('topics'),
    }),
  ),
});
