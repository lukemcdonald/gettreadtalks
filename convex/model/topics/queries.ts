import type { TopicSortOption } from '../../lib/sort';

import { asyncMap } from 'convex-helpers';
import { getManyFrom, getOneFrom } from 'convex-helpers/server/relationships';
import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { getTopicComparator } from '../../lib/sort';
import { enrichWithSpeaker, paginateArray } from '../../lib/utils';
import { talkWithSpeakerValidator } from '../../lib/validators/query';
import { doc, docs } from '../../lib/validators/schema';
import { requireAuth } from '../auth/utils';
import { LIST_SEARCH_LIMIT } from '../search/constants';
import { normalizeSearchQuery } from '../search/utils';
import {
  listPublishedTalksForTopic,
  searchPublishedTalksByTitleOrSpeaker,
} from '../talks/helpers';
import { listPublishedTopics, searchPublishedTopics } from './helpers';

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
    const queryText = normalizeSearchQuery(search ?? '');

    const topic = await getOneFrom(ctx.db, 'topics', 'by_slug', slug);

    if (!topic) {
      return null;
    }

    let publishedTalks = await listPublishedTalksForTopic(ctx, topic._id);

    if (queryText) {
      const matches = await searchPublishedTalksByTitleOrSpeaker(
        ctx,
        queryText,
        LIST_SEARCH_LIMIT
      );
      const matchIds = new Set(matches.map((talk) => talk._id));
      publishedTalks = publishedTalks.filter((talk) => matchIds.has(talk._id));
    }

    const filteredTalks = await enrichWithSpeaker(ctx, publishedTalks);

    const { continueCursor, isDone, page } = paginateArray(
      filteredTalks,
      paginationOpts.cursor,
      paginationOpts.numItems
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
    })
  ),
});

/**
 * List all topics for admin use, with total talk count (all statuses).
 */
export const listAllTopics = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);

    const topics = await ctx.db.query('topics').withIndex('by_title').collect();

    return await asyncMap(topics, async (topic) => {
      const talksOnTopic = await getManyFrom(
        ctx.db,
        'talksOnTopics',
        'by_topicId',
        topic._id
      );

      return {
        talkCount: talksOnTopic.length,
        topic,
      };
    });
  },
  returns: v.array(
    v.object({
      talkCount: v.number(),
      topic: doc('topics'),
    })
  ),
});

/**
 * List slugs for topics with published talks.
 */
export const listTopicSlugs = query({
  args: {},
  handler: async (ctx) => {
    const topics = await listPublishedTopics(ctx);

    return topics.map((topic) => ({
      slug: topic.slug,
      updatedAt: topic.updatedAt ?? topic._creationTime,
    }));
  },
  returns: v.array(
    v.object({
      slug: v.string(),
      updatedAt: v.number(),
    })
  ),
});

/**
 * List topics that have at least one published talk.
 * Returns topics sorted alphabetically by title.
 */
export const listTopics = query({
  args: {},
  handler: async (ctx) => await listPublishedTopics(ctx),
  returns: docs('topics'),
});

/**
 * List topics with their published talk counts.
 * Supports filtering by search and sorting.
 * Only returns topics that have at least one published talk.
 */
export const listTopicsWithCount = query({
  args: {
    limit: v.optional(v.number()),
    search: v.optional(v.string()),
    sort: v.optional(
      v.union(
        v.literal('alphabetical'),
        v.literal('least-talks'),
        v.literal('most-talks')
      )
    ),
  },
  handler: async (ctx, args) => {
    const { limit = 100, search, sort = 'alphabetical' } = args;
    const queryText = normalizeSearchQuery(search ?? '');

    const topics = queryText
      ? await searchPublishedTopics(ctx, queryText, limit)
      : await listPublishedTopics(ctx, limit);

    const topicsWithCounts = await asyncMap(topics, async (topic) => {
      const publishedTalks = await listPublishedTalksForTopic(ctx, topic._id);

      return {
        count: publishedTalks.length,
        topic,
      };
    });

    const results = topicsWithCounts.filter((item) => item.count > 0);

    // Apply sorting
    results.sort(getTopicComparator(sort as TopicSortOption));

    return results;
  },
  returns: v.array(
    v.object({
      count: v.number(),
      topic: doc('topics'),
    })
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

    const topics = await listPublishedTopics(ctx, limit);

    const topicsWithTalks = await asyncMap(topics, async (topic) => {
      const publishedTalks = await listPublishedTalksForTopic(ctx, topic._id);

      // Sort: featured talks first, then by creation date (newest first)
      publishedTalks.sort((a, b) => {
        if (a.featured && !b.featured) {
          return -1;
        }
        if (!a.featured && b.featured) {
          return 1;
        }
        return b._creationTime - a._creationTime;
      });

      const limitedTalks = publishedTalks.slice(0, talksPerTopic);
      const talksWithSpeakers = await enrichWithSpeaker(ctx, limitedTalks);

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
    })
  ),
});
