import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { ObjectType } from 'convex/values';

import {
  getTopicArgs,
  getTopicBySlugArgs,
  getTopicWithContentArgs,
  listTopicsArgs,
} from './validators';

/**
 * Get topic by ID.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Topic or null if not found
 */
export async function getTopic(ctx: QueryCtx, args: ObjectType<typeof getTopicArgs>) {
  return await ctx.db.get(args.id);
}

/**
 * Get topic by slug.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Topic or null if not found
 */
export async function getTopicBySlug(ctx: QueryCtx, args: ObjectType<typeof getTopicBySlugArgs>) {
  return await ctx.db
    .query('topics')
    .withIndex('by_slug', (q) => q.eq('slug', args.slug))
    .unique();
}

/**
 * Get topics.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of topics
 */
export async function getTopics(ctx: QueryCtx, args: ObjectType<typeof listTopicsArgs>) {
  const { limit = 100 } = args;

  return await ctx.db.query('topics').withIndex('by_title').take(limit);
}

/**
 * Get topic with related talks and clips.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Topic with related talks and clips
 */
export async function getTopicWithContent(
  ctx: QueryCtx,
  args: ObjectType<typeof getTopicWithContentArgs>,
) {
  const { limit = 50, slug } = args;

  const topic = await getTopicBySlug(ctx, { slug });

  if (!topic) {
    return null;
  }

  const queries = {
    clipTopics: ctx.db
      .query('clipsOnTopics')
      .withIndex('by_topic_id', (q) => q.eq('topicId', topic._id))
      .take(limit),
    talkTopics: ctx.db
      .query('talksOnTopics')
      .withIndex('by_topic_id', (q) => q.eq('topicId', topic._id))
      .take(limit),
  };

  // Get related talks and clips in parallel
  const [clipTopics, talkTopics] = await Promise.all([queries.clipTopics, queries.talkTopics]);

  // Get talks and clips in parallel.
  const [clipResults, talkResults] = await Promise.all([
    Promise.all(
      clipTopics.map(async (clipTopic) => {
        const clip = await ctx.db.get(clipTopic.clipId);
        return clip && clip.status === 'published' ? clip : null;
      }),
    ),
    Promise.all(
      talkTopics.map(async (talkTopic) => {
        const talk = await ctx.db.get(talkTopic.talkId);
        return talk && talk.status === 'published' ? talk : null;
      }),
    ),
  ]);

  // Filter out null results with proper type guards.
  const talks = talkResults.filter((talk): talk is Doc<'talks'> => Boolean(talk));
  const clips = clipResults.filter((clip): clip is Doc<'clips'> => Boolean(clip));

  return {
    clips,
    talks,
    topic,
  };
}
