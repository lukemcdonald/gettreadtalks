import type { PaginationResult } from 'convex/server';
import type { Doc } from '../../_generated/dataModel';

import { paginationOptsValidator, paginationResultValidator } from 'convex/server';
import { v } from 'convex/values';
import { asyncMap } from 'convex-helpers';
import { getManyVia, getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { doc, docs } from '../../lib/validators/schema';
import { statusType } from './validators';

const clipPageValidator = paginationResultValidator(doc('clips'));

/**
 * Get clip by slug with related data (default for detail pages).
 * Returns clip with speaker, talk, and topics.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Clip with speaker, talk, and topics data
 */
export const getClipBySlug = query({
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
  returns: v.nullable(
    v.object({
      clip: doc('clips'),
      speaker: doc('speakers').nullable(),
      talk: doc('talks').nullable(),
      topics: docs('topics'),
    }),
  ),
});

/**
 * List clips with optional filters and pagination.
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated clips
 */
export const listClips = query({
  args: {
    paginationOpts: paginationOptsValidator,
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
  returns: clipPageValidator,
});

/**
 * List clips with speaker data (paginated).
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated clips with speaker information
 */
export const listClipsWithSpeakers = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(statusType),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, status } = args;

    let result: PaginationResult<Doc<'clips'>>;
    if (status) {
      result = await ctx.db
        .query('clips')
        .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
        .order('desc')
        .paginate(paginationOpts);
    } else {
      result = await ctx.db.query('clips').order('desc').paginate(paginationOpts);
    }

    const enrichedPage = await asyncMap(result.page, async (clip) => {
      const speaker = clip.speakerId ? await ctx.db.get(clip.speakerId) : null;
      return { ...clip, speaker };
    });

    return {
      ...result,
      page: enrichedPage,
    };
  },
  returns: clipPageValidator,
});

/**
 * List clips by speaker.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Array of clips by speaker
 */
export const listClipsBySpeaker = query({
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
