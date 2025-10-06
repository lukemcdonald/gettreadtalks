import type { QueryCtx } from '../_generated/server';

/**
 * Get published clips
 * @param ctx - Database context
 * @param limit - Maximum number of results
 * @returns Array of published clips
 */
export async function getPublished(ctx: QueryCtx, limit: number) {
  return await ctx.db
    .query('clips')
    .withIndex('by_status_and_published_at', (q) => q.eq('status', 'published'))
    .order('desc')
    .take(limit);
}

/**
 * Get clip by slug with related data.
 *
 * @param ctx - Database context
 * @param slug - Clip slug
 * @param topicLimit - Maximum number of topics to fetch
 * @returns Clip with speaker, talk, and topics data
 */
export async function getBySlugWithRelations(ctx: QueryCtx, slug: string, topicLimit: number = 20) {
  const clip = await ctx.db
    .query('clips')
    .withIndex('by_slug', (q) => q.eq('slug', slug))
    .unique();

  if (!clip || clip.status !== 'published') {
    return null;
  }

  const queries = {
    speaker: clip.speakerId ? ctx.db.get(clip.speakerId) : null,
    talk: clip.talkId ? ctx.db.get(clip.talkId) : null,
    clipTopics: ctx.db
      .query('clipsOnTopics')
      .withIndex('by_clip_id', (q) => q.eq('clipId', clip._id))
      .take(topicLimit),
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
