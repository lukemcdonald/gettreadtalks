import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';

/**
 * Get topic by ID.
 *
 * @param ctx - Database context
 * @param id - Topic ID
 * @returns Topic or null if not found
 */
export async function getTopic(ctx: QueryCtx, id: Id<'topics'>) {
  return await ctx.db.get(id);
}

/**
 * Get topic by slug.
 *
 * @param ctx - Database context
 * @param slug - Topic slug
 * @returns Topic or null if not found
 */
export async function getTopicBySlug(ctx: QueryCtx, slug: string) {
  return await ctx.db
    .query('topics')
    .withIndex('by_slug', (q) => q.eq('slug', slug))
    .unique();
}

/**
 * Get topics.
 *
 * @param ctx - Database context
 * @param limit - Maximum number of results
 * @returns Array of topics
 */
export async function getTopics(ctx: QueryCtx, limit: number = 100) {
  return await ctx.db.query('topics').withIndex('by_title').take(limit);
}

/**
 * Get topic with related talks and clips.
 *
 * @param ctx - Database context
 * @param slug - Topic slug
 * @param limit - Maximum number of talks/clips to fetch
 * @returns Topic with related talks and clips
 */
export async function getTopicWithContent(ctx: QueryCtx, slug: string, limit: number = 50) {
  const topic = await getTopicBySlug(ctx, slug);

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
