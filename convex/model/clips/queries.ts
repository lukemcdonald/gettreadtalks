import type { PaginationOptions } from 'convex/server';
import type { Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { StatusType } from '../../lib/types';

import { getManyVia, getOneFrom } from 'convex-helpers/server/relationships';

/**
 * Get clips with optional filters and pagination.
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated clips
 */
export async function getClips(
  ctx: QueryCtx,
  args: { paginationOpts: PaginationOptions; status?: StatusType },
) {
  const { paginationOpts, status } = args;

  if (status) {
    return await ctx.db
      .query('clips')
      .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
      .order('desc')
      .paginate(paginationOpts);
  }

  return await ctx.db.query('clips').order('desc').paginate(paginationOpts);
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
  args: { limit?: number; speakerId: Id<'speakers'> },
) {
  const { limit = 20, speakerId } = args;

  return await ctx.db
    .query('clips')
    .withIndex('by_speakerId_and_status', (q) =>
      q.eq('speakerId', speakerId).eq('status', 'published'),
    )
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
export async function getClipBySlugWithRelations(ctx: QueryCtx, args: { slug: string }) {
  const clip = await getOneFrom(ctx.db, 'clips', 'by_slug', args.slug);

  if (!clip || clip.status !== 'published') {
    return null;
  }

  const queries = {
    speaker: clip.speakerId ? ctx.db.get(clip.speakerId) : null,
    talk: clip.talkId ? ctx.db.get(clip.talkId) : null,
    topics: getManyVia(ctx.db, 'clipsOnTopics', 'topicId', 'by_clipId', clip._id, 'clipId'),
  };

  const [speaker, talk, topics] = await Promise.all([
    queries.speaker,
    queries.talk,
    queries.topics,
  ]);

  const validTopics = topics.filter((topic) => topic !== null);

  return { clip, speaker, talk, topics: validTopics };
}
