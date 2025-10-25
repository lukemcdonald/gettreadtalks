import type { Doc } from '../../_generated/dataModel';

import { v } from 'convex/values';
import { asyncMap } from 'convex-helpers';
import { getManyFrom, getManyVia, getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { doc, docs } from '../../lib/validators/schema';

/**
 * Get topic by ID.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Topic or null if not found
 */
export const getTopic = query({
  args: {
    id: v.id('topics'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
  returns: doc('topics', true),
});

/**
 * Get topic by slug.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Topic or null if not found
 */
export const getTopicBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await getOneFrom(ctx.db, 'topics', 'by_slug', args.slug);
  },
  returns: doc('topics', true),
});

/**
 * Get topic with related talks and clips.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Topic with related talks and clips
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

    // Get related talks and clips via join tables
    const [allClips, allTalks] = await Promise.all([
      getManyVia(ctx.db, 'clipsOnTopics', 'clipId', 'by_topicId', topic._id, 'topicId'),
      getManyVia(ctx.db, 'talksOnTopics', 'talkId', 'by_topicId', topic._id, 'topicId'),
    ]);

    // Filter for published content only and apply limits
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
  returns: v.union(
    v.object({
      clips: docs('clips'),
      talks: docs('talks'),
      topic: doc('topics'),
    }),
    v.null(),
  ),
});

/**
 * List topics.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of topics
 */
export const listTopics = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 100 } = args;

    return await ctx.db.query('topics').withIndex('by_title').take(limit);
  },
  returns: docs('topics'),
});

/**
 * List topics with talk counts.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of topics with talk counts
 */
export const listTopicsWithCount = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 100 } = args;

    const topics = await ctx.db.query('topics').withIndex('by_title').take(limit);

    // Get talk counts for each topic in parallel
    const topicsWithCounts = await asyncMap(topics, async (topic) => {
      const talkTopics = await getManyFrom(ctx.db, 'talksOnTopics', 'by_topicId', topic._id);

      return {
        count: talkTopics.length,
        topic,
      };
    });

    // Sort by count descending
    return topicsWithCounts.sort((a, b) => b.count - a.count);
  },
  returns: v.array(
    v.object({
      count: v.number(),
      topic: doc('topics'),
    }),
  ),
});
