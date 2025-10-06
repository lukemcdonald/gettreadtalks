import type { DatabaseReader } from '../_generated/server';
import type { Id } from '../_generated/dataModel';
import type { Doc } from '../_generated/dataModel';

/**
 * Get topic by slug
 * @param ctx - Database context
 * @param slug - Topic slug
 * @returns Topic or null if not found
 */
export async function getBySlug(ctx: DatabaseReader, slug: string): Promise<Doc<'topics'> | null> {
  return await ctx
    .query('topics')
    .withIndex('by_slug', (q) => q.eq('slug', slug))
    .unique();
}

/**
 * Get topic with related talks and clips
 * @param ctx - Database context
 * @param slug - Topic slug
 * @param limit - Maximum number of talks/clips to fetch
 * @returns Topic with related talks and clips
 */
export async function getWithContent(
  ctx: DatabaseReader,
  slug: string,
  limit: number = 50,
): Promise<{
  topic: Doc<'topics'>;
  talks: Doc<'talks'>[];
  clips: Doc<'clips'>[];
} | null> {
  const topic = await getBySlug(ctx, slug);

  if (!topic) {
    return null;
  }

  // Get related talks and clips in parallel
  const [talkTopics, clipTopics] = await Promise.all([
    ctx
      .query('talksOnTopics')
      .withIndex('by_topic_id', (q) => q.eq('topicId', topic._id))
      .take(limit),
    ctx
      .query('clipsOnTopics')
      .withIndex('by_topic_id', (q) => q.eq('topicId', topic._id))
      .take(limit),
  ]);

  // Get talks
  const talks = [];
  for (const talkTopic of talkTopics) {
    const talk = await ctx.db.get(talkTopic.talkId);
    if (talk && talk.status === 'published') {
      talks.push(talk);
    }
  }

  // Get clips
  const clips = [];
  for (const clipTopic of clipTopics) {
    const clip = await ctx.db.get(clipTopic.clipId);
    if (clip && clip.status === 'published') {
      clips.push(clip);
    }
  }

  return {
    topic,
    talks,
    clips,
  };
}
