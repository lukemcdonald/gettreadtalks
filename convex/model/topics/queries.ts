import type { Doc } from '../../_generated/dataModel';
import type { TopicSortOption } from '../../lib/sort';

import { paginationOptsValidator, paginationResultValidator } from 'convex/server';
import { v } from 'convex/values';
import { asyncMap } from 'convex-helpers';
import { getManyFrom, getManyVia, getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { getTopicComparator } from '../../lib/sort';
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
 * Get topic with related talks.
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

    const allTalks = await getManyVia(
      ctx.db,
      'talksOnTopics',
      'talkId',
      'by_topicId',
      topic._id,
      'topicId',
    );

    const talks = allTalks
      .filter((talk): talk is Doc<'talks'> => talk !== null && talk.status === 'published')
      .slice(0, limit);

    return {
      talks,
      topic,
    };
  },
  returns: v.nullable(
    v.object({
      talks: docs('talks'),
      topic: doc('topics'),
    }),
  ),
});

/**
 * Get topic by slug with related data and pagination support.
 * Returns topic with related talks (each with speaker) and clips.
 * Supports search filtering on talk title and speaker name.
 */
export const getTopicBySlug = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, search, slug } = args;

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

    // Enrich with speakers before filtering so we can search by speaker name
    const talksWithSpeakers = await enrichWithSpeakers(ctx, publishedTalks);

    // Apply search filter
    let filteredTalks = talksWithSpeakers;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTalks = talksWithSpeakers.filter((talk) => {
        const titleMatch = talk.title.toLowerCase().includes(searchLower);
        const speakerMatch = talk.speaker
          ? `${talk.speaker.firstName ?? ''} ${talk.speaker.lastName ?? ''}`
              .toLowerCase()
              .includes(searchLower)
          : false;
        return titleMatch || speakerMatch;
      });
    }

    const { continueCursor, isDone, page } = paginateArray(
      filteredTalks,
      paginationOpts.cursor,
      paginationOpts.numItems,
    );

    return {
      continueCursor,
      isDone,
      page,
      topic,
      totalTalks: filteredTalks.length,
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
    results.sort(getTopicComparator(sort as TopicSortOption));

    return results;
  },
  returns: v.array(
    v.object({
      count: v.number(),
      topic: doc('topics'),
    }),
  ),
});

/**
 * List topics with their talks for browsing.
 * Returns topics with up to 5 talks each (featured first), enriched with speakers.
 * Used for the topics browse page with horizontal scroll sections.
 */
export const listTopicsWithTalks = query({
  args: {
    limit: v.optional(v.number()),
    talksPerTopic: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 100, talksPerTopic = 5 } = args;

    const topics = await ctx.db.query('topics').withIndex('by_title').take(limit);

    const topicsWithTalks = await asyncMap(topics, async (topic) => {
      const talksOnTopics = await getManyFrom(ctx.db, 'talksOnTopics', 'by_topicId', topic._id);
      const talks = await Promise.all(
        talksOnTopics.map((entry) => ctx.db.get('talks', entry.talkId)),
      );

      const publishedTalks = talks.filter(
        (talk): talk is Doc<'talks'> => talk !== null && talk.status === 'published',
      );

      // Sort: featured talks first, then by creation date (newest first)
      publishedTalks.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b._creationTime - a._creationTime;
      });

      const limitedTalks = publishedTalks.slice(0, talksPerTopic);
      const talksWithSpeakers = await enrichWithSpeakers(ctx, limitedTalks);

      return {
        talkCount: publishedTalks.length,
        talks: talksWithSpeakers,
        topic,
      };
    });

    // Filter to topics with at least one published talk
    return topicsWithTalks.filter((item) => item.talkCount > 0);
  },
  returns: v.array(
    v.object({
      talkCount: v.number(),
      talks: v.array(talkWithSpeakerValidator),
      topic: doc('topics'),
    }),
  ),
});
