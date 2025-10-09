import type { QueryCtx } from '../../_generated/server';

import type {
  GetClipBySlugWithRelationsArgs,
  ListClipsArgs,
  ListPublishedClipsArgs,
} from './types';

/**
 * Get clips with optional filters.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of clips
 */
export async function getClips(ctx: QueryCtx, args: ListClipsArgs) {
  const { limit = 20, status } = args;

  if (status) {
    return await ctx.db
      .query('clips')
      .withIndex('by_status_and_published_at', (q) => q.eq('status', status))
      .order('desc')
      .take(limit);
  }

  return await ctx.db.query('clips').take(limit);
}

/**
 * Get published clips.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Array of published clips
 */
export async function getPublishedClips(ctx: QueryCtx, args: ListPublishedClipsArgs) {
  return await ctx.db
    .query('clips')
    .withIndex('by_status_and_published_at', (q) => q.eq('status', 'published'))
    .order('desc')
    .take(args.limit);
}

/**
 * Get clip by slug with related data.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Clip with speaker, talk, and topics data
 */
export async function getBySlugWithRelations(ctx: QueryCtx, args: GetClipBySlugWithRelationsArgs) {
  const clip = await ctx.db
    .query('clips')
    .withIndex('by_slug', (q) => q.eq('slug', args.slug))
    .unique();

  if (!clip || clip.status !== 'published') {
    return null;
  }

  const queries = {
    clipTopics: ctx.db
      .query('clipsOnTopics')
      .withIndex('by_clip_id', (q) => q.eq('clipId', clip._id))
      .collect(),
    speaker: clip.speakerId ? ctx.db.get(clip.speakerId) : null,
    talk: clip.talkId ? ctx.db.get(clip.talkId) : null,
  };

  const [speaker, talk, clipTopics] = await Promise.all([
    queries.speaker,
    queries.talk,
    queries.clipTopics,
  ]);

  const topics = await Promise.all(
    clipTopics.map(async (clipTopic) => {
      return await ctx.db.get(clipTopic.topicId);
    }),
  );

  const validTopics = topics.filter((topic) => topic !== null);

  return { clip, speaker, talk, topics: validTopics };
}
