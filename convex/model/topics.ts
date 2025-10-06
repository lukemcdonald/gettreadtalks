import type { QueryCtx, MutationCtx } from '../_generated/server';
import type { Id } from '../_generated/dataModel';
import type { Doc } from '../_generated/dataModel';

/**
 * Get topic by slug
 * @param ctx - Database context
 * @param slug - Topic slug
 * @returns Topic or null if not found
 */
export async function getBySlug(ctx: QueryCtx, slug: string): Promise<Doc<'topics'> | null> {
  return await ctx.db
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
  ctx: QueryCtx,
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
    ctx.db
      .query('talksOnTopics')
      .withIndex('by_topic_id', (q) => q.eq('topicId', topic._id))
      .take(limit),
    ctx.db
      .query('clipsOnTopics')
      .withIndex('by_topic_id', (q) => q.eq('topicId', topic._id))
      .take(limit),
  ]);

  // Get talks and clips in parallel
  const [talkResults, clipResults] = await Promise.all([
    Promise.all(
      talkTopics.map(async (talkTopic) => {
        const talk = await ctx.db.get(talkTopic.talkId);
        return talk && talk.status === 'published' ? talk : null;
      }),
    ),
    Promise.all(
      clipTopics.map(async (clipTopic) => {
        const clip = await ctx.db.get(clipTopic.clipId);
        return clip && clip.status === 'published' ? clip : null;
      }),
    ),
  ]);

  // Filter out null results
  const talks = talkResults.filter((talk): talk is Doc<'talks'> => talk !== null);
  const clips = clipResults.filter((clip): clip is Doc<'clips'> => clip !== null);

  return {
    topic,
    talks,
    clips,
  };
}
