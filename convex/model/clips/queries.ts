import type { QueryCtx } from '../../_generated/server';

import type { GetClipBySlugWithRelationsArgs, GetPublishedClipsArgs } from './types';

/**
 * Get published clips.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Array of published clips
 */
export async function getPublishedClips(ctx: QueryCtx, args: GetPublishedClipsArgs) {
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
 * @param args - Query arguments with defaults
 * @returns Clip with speaker, talk, and topics data
 */
export async function getBySlugWithRelations(ctx: QueryCtx, args: GetClipBySlugWithRelationsArgs) {
  const { slug, topicLimit = 20 } = args;

  const clip = await ctx.db
    .query('clips')
    .withIndex('by_slug', (q) => q.eq('slug', slug))
    .unique();

  if (!clip || clip.status !== 'published') {
    return null;
  }

  const queries = {
    clipTopics: ctx.db
      .query('clipsOnTopics')
      .withIndex('by_clip_id', (q) => q.eq('clipId', clip._id))
      .take(topicLimit),
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
