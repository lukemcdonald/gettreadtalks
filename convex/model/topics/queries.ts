import { asyncMap } from 'convex-helpers';
import { getManyFrom, getManyVia, getOneFrom } from 'convex-helpers/server/relationships';

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
  return await getOneFrom(ctx.db, 'topics', 'by_slug', args.slug);
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
  const topicsWithCounts = await asyncMap(topics, async (topic) => {
    const talkTopics = await getManyFrom(ctx.db, 'talksOnTopics', 'by_topicId', topic._id);

    return {
      count: talkTopics.length,
      topic,
    };
  });

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
}
