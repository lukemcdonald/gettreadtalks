import type { PaginationResult } from 'convex/server';
import type { Doc } from '../../_generated/dataModel';

import { paginationOptsValidator, paginationResultValidator } from 'convex/server';
import { v } from 'convex/values';
import { asyncMap } from 'convex-helpers';
import { getManyVia, getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { filterClipsByPublishedTalks } from '../../lib/filters';
import { doc, docs } from '../../lib/validators/schema';
import { statusFilterType } from '../../lib/validators/shared';
import { canViewContent } from '../auth/roles';
import { getCurrentUser } from '../auth/utils';
import { statusType } from './validators';

const clipPageValidator = paginationResultValidator(doc('clips'));
const clipPageWithSpeakersValidator = paginationResultValidator(
  doc('clips').extend({
    speaker: doc('speakers').nullable(),
  }),
);

/**
 * Get clip by slug with related data (default for detail pages).
 * Returns clip with speaker, talk, and topics.
 */
export const getClipBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const clip = await getOneFrom(ctx.db, 'clips', 'by_slug', args.slug);

    if (!clip) {
      return null;
    }

    const user = await getCurrentUser(ctx);

    // Non-admin users can only view published clips
    if (!canViewContent(user, clip.status)) {
      return null;
    }

    const clipId = clip._id;
    const speakerId = clip.speakerId;
    const talkId = clip.talkId;

    const queries = {
      speaker: speakerId ? ctx.db.get('speakers', speakerId) : null,
      talk: talkId ? ctx.db.get('talks', talkId) : null,
      topics: getManyVia(ctx.db, 'clipsOnTopics', 'topicId', 'by_clipId', clipId, 'clipId'),
    };

    const [speaker, talk, topics] = await Promise.all([
      queries.speaker,
      queries.talk,
      queries.topics,
    ]);

    const validTopics = topics.filter((topic) => topic !== null);

    return {
      clip,
      speaker,
      talk,
      topics: validTopics,
    };
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
 */
export const listClips = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(statusType),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, status } = args;

    if (status) {
      // TODO: Can we build this query and do a single return await at end?
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
 * List clips with speaker data (paginated, public-facing).
 * Filters clips to only those with published parent talks.
 * Clips without a parent talk (standalone) are included.
 * Defaults to published status.
 */
export const listClipsWithSpeakers = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(statusType),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, status = 'published' } = args;

    let clipPages: PaginationResult<Doc<'clips'>>;

    if (status) {
      // TODO: Can we build this query and do a single return await result?
      clipPages = await ctx.db
        .query('clips')
        .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
        .order('desc')
        .paginate(paginationOpts);
    } else {
      clipPages = await ctx.db.query('clips').order('desc').paginate(paginationOpts);
    }

    const filtered = await filterClipsByPublishedTalks(ctx, clipPages.page);

    const enrichedPage = await asyncMap(filtered, async (clip) => {
      const speakerId = clip.speakerId;
      const speaker = speakerId ? await ctx.db.get('speakers', speakerId) : null;
      return { ...clip, speaker };
    });

    return {
      ...clipPages,
      page: enrichedPage,
    };
  },
  returns: clipPageWithSpeakersValidator,
});

/**
 * List clips by speaker.
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

/**
 * List clips with speaker data (admin).
 * Returns all clips without filtering by parent talk status.
 * Allows viewing all status types including drafts.
 */
export const listClipsWithSpeakersAdmin = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(statusFilterType),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, status } = args;

    let clipPages: PaginationResult<Doc<'clips'>>;

    // Simplify: !status || status === 'all'. Maybe build query with single await
    if (status === 'all') {
      clipPages = await ctx.db.query('clips').order('desc').paginate(paginationOpts);
    } else if (status) {
      clipPages = await ctx.db
        .query('clips')
        .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
        .order('desc')
        .paginate(paginationOpts);
    } else {
      clipPages = await ctx.db.query('clips').order('desc').paginate(paginationOpts);
    }

    const enrichedPage = await asyncMap(clipPages.page, async (clip) => {
      const speakerId = clip.speakerId;
      const speaker = speakerId ? await ctx.db.get('speakers', speakerId) : null;
      return { ...clip, speaker };
    });

    return {
      ...clipPages,
      page: enrichedPage,
    };
  },
  returns: clipPageWithSpeakersValidator,
});
