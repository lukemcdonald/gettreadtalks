import type { Doc } from '../../_generated/dataModel';

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
 * Get topic by slug with related data (default for detail pages).
 * Returns topic with related talks (each with speaker) and clips.
 */
export const getTopicBySlug = query({
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

    const publishedTalks = allTalks
      .filter((talk): talk is Doc<'talks'> => talk !== null && talk.status === 'published')
      .slice(0, limit);

    const talksWithSpeakers = await asyncMap(publishedTalks, async (talk: Doc<'talks'>) => {
      const speaker = await ctx.db.get('speakers', talk.speakerId);
      return { ...talk, speaker };
    });

    return {
      clips,
      talks: talksWithSpeakers,
      topic,
    };
  },
  returns: v.nullable(
    v.object({
      clips: docs('clips'),
      talks: v.array(talkWithSpeakerValidator),
      topic: doc('topics'),
    }),
  ),
});

/**
 * List topics.
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
 */
export const listTopicsWithCount = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 100 } = args;

    const topics = await ctx.db.query('topics').withIndex('by_title').take(limit);

    const topicsWithCounts = await asyncMap(topics, async (topic) => {
      const talkTopics = await getManyFrom(ctx.db, 'talksOnTopics', 'by_topicId', topic._id);

      return {
        count: talkTopics.length,
        topic,
      };
    });

    return topicsWithCounts.sort((a, b) => b.count - a.count);
  },
  returns: v.array(
    v.object({
      count: v.number(),
      topic: doc('topics'),
    }),
  ),
});
