import type { Doc } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type {
  GetTopicArgs,
  GetTopicBySlugArgs,
  GetTopicWithContentArgs,
  ListTopicsArgs,
} from './types';

/**
 * Get topic by ID.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Topic or null if not found
 */
export async function getTopic(ctx: QueryCtx, args: GetTopicArgs) {
  return await ctx.db.get(args.id);
}

/**
 * Get topic by slug.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Topic or null if not found
 */
export async function getTopicBySlug(ctx: QueryCtx, args: GetTopicBySlugArgs) {
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
export async function getTopics(ctx: QueryCtx, args: ListTopicsArgs) {
  const { limit = 100 } = args;

  return await ctx.db.query('topics').withIndex('by_title').take(limit);
}

/**
 * Get topics with talk counts.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of topics with talk counts
 */
export async function getTopicsWithCount(ctx: QueryCtx, args: { limit?: number }) {
  const { limit = 100 } = args;

  const topics = await ctx.db.query('topics').withIndex('by_title').take(limit);

  // Get talk counts for each topic in parallel
  const topicsWithCounts = await Promise.all(
    topics.map(async (topic) => {
      // Intentionally unbounded: Used only for counting talks per topic
      // TODO: Replace with .count() when available
      const talkTopics = await ctx.db
        .query('talksOnTopics')
        .withIndex('by_topic_id', (q) => q.eq('topicId', topic._id))
        .collect();

      return {
        count: talkTopics.length,
        topic,
      };
    }),
  );

  // Sort by count descending
  return topicsWithCounts.sort((a, b) => b.count - a.count);
}

/**
 * Get topic with related talks and clips.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Topic with related talks and clips
 */
export async function getTopicWithContent(ctx: QueryCtx, args: GetTopicWithContentArgs) {
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
