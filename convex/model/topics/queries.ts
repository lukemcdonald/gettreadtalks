import type { Doc } from '../../_generated/dataModel';

import { paginationOptsValidator, paginationResultValidator } from 'convex/server';
import { v } from 'convex/values';
import { asyncMap } from 'convex-helpers';
import { getManyFrom, getManyVia, getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
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

    // Manual pagination
    const startIndex = paginationOpts.cursor ? Number.parseInt(paginationOpts.cursor, 10) : 0;
    const endIndex = startIndex + paginationOpts.numItems;
    const page = publishedTalks.slice(startIndex, endIndex);
    const hasMore = endIndex < publishedTalks.length;

    const talksWithSpeakers = await asyncMap(page, async (talk: Doc<'talks'>) => {
      const speaker = await ctx.db.get('speakers', talk.speakerId);
      return { ...talk, speaker };
    });

    return {
      continueCursor: hasMore ? endIndex.toString() : '',
      isDone: !hasMore,
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

/**
 * List topics with their published talk counts.
 * Only returns topics that have at least one published talk.
 * Returns topics sorted alphabetically by title.
 */
export const listTopicsWithCount = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 100 } = args;

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

    const topicsWithTalks = topicsWithCounts.filter((item) => item.count > 0);

    return topicsWithTalks.sort((a, b) => a.topic.title.localeCompare(b.topic.title));
  },
  returns: v.array(
    v.object({
      count: v.number(),
      topic: doc('topics'),
    }),
  ),
});
