import type { PaginationOptions } from 'convex/server';
import type { QueryCtx } from '../../_generated/server';

import type {
  GetClipBySlugWithRelationsArgs,
  ListClipsArgs,
  ListPublishedClipsArgs,
} from './types';

/**
 * Get clips with optional filters and pagination.
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated clips
 */
export async function getClips(
  ctx: QueryCtx,
  args: { paginationOpts: PaginationOptions; status?: string },
) {
  if (args.status) {
    return await ctx.db
      .query('clips')
      .withIndex('by_status_and_published_at', (q) => q.eq('status', args.status))
      .order('desc')
      .paginate(args.paginationOpts);
  }

  return await ctx.db.query('clips').order('desc').paginate(args.paginationOpts);
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
 * Get clips by speaker.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Array of clips by speaker
 */
export async function getClipsBySpeaker(
  ctx: QueryCtx,
  args: { limit?: number; speakerId: string },
) {
  const { limit = 20, speakerId } = args;

  return await ctx.db
    .query('clips')
    .withIndex('by_speaker_id', (q) => q.eq('speakerId', speakerId))
    .filter((q) => q.eq(q.field('status'), 'published'))
    .order('desc')
    .take(limit);
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
