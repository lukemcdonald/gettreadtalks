import type { PaginationOptions } from 'convex/server';

import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { doc, docs } from '../../lib/validators/schema';
import { getManyVia, getOneFrom } from 'convex-helpers/server/relationships';
import { statusType } from './validators';

/**
 * Get clips with optional filters and pagination.
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated clips
 */
export const getClips = query({
  args: {
    paginationOpts: v.any(), // PaginationOptions
    status: v.optional(statusType),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, status } = args;

    if (status) {
      return await ctx.db
        .query('clips')
        .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
        .order('desc')
        .paginate(paginationOpts);
    }

    return await ctx.db.query('clips').order('desc').paginate(paginationOpts);
  },
  returns: v.any(), // PaginationResult<Doc<'clips'>>
});

/**
 * Get clips by speaker.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Array of clips by speaker
 */
export const getClipsBySpeaker = query({
  args: {
    limit: v.optional(v.number()),
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    const { limit = 20, speakerId } = args;

    return await ctx.db
      .query('clips')
      .withIndex('by_speakerId_and_status', (q) =>
        q.eq('speakerId', speakerId).eq('status', 'published'),
      )
      .order('desc')
      .take(limit);
  },
  returns: docs('clips'),
});

/**
 * Get clip by slug with related data.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Clip with speaker, talk, and topics data
 */
export const getClipBySlugWithRelations = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
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
  },
  returns: v.union(
    v.object({
      clip: doc('clips'),
      speaker: doc('speakers', true),
      talk: doc('talks', true),
      topics: docs('topics'),
    }),
    v.null(),
  ),
});
