import type { PaginationResult } from 'convex/server';
import type { Doc } from '../../_generated/dataModel';

import { paginationOptsValidator, paginationResultValidator } from 'convex/server';
import { v } from 'convex/values';
import { asyncMap } from 'convex-helpers';
import { getManyVia, getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { filterClipsByPublishedTalks } from '../../lib/filters';
import { applySearchFilter, paginateArray } from '../../lib/utils';
import { doc, docs } from '../../lib/validators/schema';
import { statusFilterType } from '../../lib/validators/shared';
import { canViewContent } from '../auth/roles';
import { getCurrentUser } from '../auth/utils';

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

const sortType = v.optional(
  v.union(v.literal('alphabetical'), v.literal('oldest'), v.literal('recent')),
);

/**
 * List published clips with speaker data (public-facing).
 * Supports filtering by search, speaker, topic, and sorting.
 * Filters clips to only those with published parent talks.
 */
export const listClips = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    sort: sortType,
    speakerSlug: v.optional(v.string()),
    topicSlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, search, sort = 'recent', speakerSlug, topicSlug } = args;

    const hasFilters = search || speakerSlug || topicSlug;
    const needsCustomSort = sort !== 'recent';

    // When no filters and default sort, use native Convex pagination
    if (!(hasFilters || needsCustomSort)) {
      const clipPages = await ctx.db
        .query('clips')
        .withIndex('by_status_and_publishedAt', (q) => q.eq('status', 'published'))
        .order('desc')
        .paginate(paginationOpts);

      const filtered = await filterClipsByPublishedTalks(ctx, clipPages.page);
      const enrichedPage = await asyncMap(filtered, async (clip) => {
        const speaker = clip.speakerId ? await ctx.db.get('speakers', clip.speakerId) : null;
        return { ...clip, speaker };
      });

      return {
        ...clipPages,
        page: enrichedPage,
      };
    }

    // With filters or custom sort, collect all and paginate in-memory
    let clips = await ctx.db
      .query('clips')
      .withIndex('by_status_and_publishedAt', (q) => q.eq('status', 'published'))
      .order('desc')
      .collect();

    // Filter to only clips with published parent talks
    clips = await filterClipsByPublishedTalks(ctx, clips);

    // Apply search filter
    if (search) {
      clips = applySearchFilter(clips, search);
    }

    // Apply speaker filter
    if (speakerSlug) {
      const speaker = await getOneFrom(ctx.db, 'speakers', 'by_slug', speakerSlug);
      if (speaker) {
        clips = clips.filter((clip) => clip.speakerId === speaker._id);
      } else {
        clips = [];
      }
    }

    // Apply topic filter
    if (topicSlug) {
      const topic = await getOneFrom(ctx.db, 'topics', 'by_slug', topicSlug);
      if (topic) {
        const clipIdsOnTopic = await ctx.db
          .query('clipsOnTopics')
          .withIndex('by_topicId', (q) => q.eq('topicId', topic._id))
          .collect();
        const topicClipIds = new Set(clipIdsOnTopic.map((c) => c.clipId));
        clips = clips.filter((clip) => topicClipIds.has(clip._id));
      } else {
        clips = [];
      }
    }

    // Apply sorting
    clips.sort((a, b) => {
      switch (sort) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'oldest':
          return (a.publishedAt || 0) - (b.publishedAt || 0);
        default:
          return (b.publishedAt || 0) - (a.publishedAt || 0);
      }
    });

    const { continueCursor, isDone, page } = paginateArray(
      clips,
      paginationOpts.cursor,
      paginationOpts.numItems,
    );

    const clipsWithSpeakers = await asyncMap(page, async (clip) => {
      const speaker = clip.speakerId ? await ctx.db.get('speakers', clip.speakerId) : null;
      return { ...clip, speaker };
    });

    return {
      continueCursor,
      isDone,
      page: clipsWithSpeakers,
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
 * List all clips with speaker data.
 * Returns all clips without filtering by parent talk status.
 * Supports status='all' to fetch clips across all statuses.
 */
export const listAllClips = query({
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
      const speaker = clip.speakerId ? await ctx.db.get('speakers', clip.speakerId) : null;
      return { ...clip, speaker };
    });

    return {
      ...clipPages,
      page: enrichedPage,
    };
  },
  returns: clipPageWithSpeakersValidator,
});
