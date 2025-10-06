import type { DatabaseReader } from '../_generated/server';
import type { Id } from '../_generated/dataModel';
import type { Doc } from '../_generated/dataModel';

/**
 * Get published clips
 * @param ctx - Database context
 * @param limit - Maximum number of results
 * @returns Array of published clips
 */
export async function getPublished(ctx: DatabaseReader, limit: number): Promise<Doc<'clips'>[]> {
  return await ctx
    .query('clips')
    .withIndex('by_status_and_published_at', (q) => q.eq('status', 'published'))
    .order('desc')
    .take(limit);
}

/**
 * Get clip by slug with related data
 * @param ctx - Database context
 * @param slug - Clip slug
 * @param topicLimit - Maximum number of topics to fetch
 * @returns Clip with speaker, talk, and topics data
 */
export async function getBySlugWithRelations(
  ctx: DatabaseReader,
  slug: string,
  topicLimit: number = 20,
): Promise<{
  clip: Doc<'clips'>;
  speaker: Doc<'speakers'> | null;
  talk: Doc<'talks'> | null;
  topics: Doc<'topics'>[];
} | null> {
  const clip = await ctx
    .query('clips')
    .withIndex('by_slug', (q) => q.eq('slug', slug))
    .unique();

  if (!clip || clip.status !== 'published') {
    return null;
  }

  // Get related data in parallel
  const [speaker, talk, clipTopics] = await Promise.all([
    clip.speakerId ? ctx.db.get(clip.speakerId) : null,
    clip.talkId ? ctx.db.get(clip.talkId) : null,
    ctx
      .query('clipsOnTopics')
      .withIndex('by_clip_id', (q) => q.eq('clipId', clip._id))
      .take(topicLimit),
  ]);

  // Get topics
  const topics = [];
  for (const clipTopic of clipTopics) {
    const topic = await ctx.db.get(clipTopic.topicId);
    if (topic) topics.push(topic);
  }

  return { clip, speaker, talk, topics };
}
