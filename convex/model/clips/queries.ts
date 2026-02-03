import type { ContentSortOption } from '../../lib/sort';

import { paginationOptsValidator, paginationResultValidator } from 'convex/server';
import { v } from 'convex/values';
import { asyncMap } from 'convex-helpers';
import { getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { filterClipsByPublishedTalks } from '../../lib/filters';
import { getContentComparator } from '../../lib/sort';
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
 * Get clip by ID.
 */
export const getClip = query({
  args: {
    id: v.id('clips'),
  },
  handler: async (ctx, args) => await ctx.db.get('clips', args.id),
  returns: doc('clips').nullable(),
});

/**
 * Get clip by slug with related data (default for detail pages).
 * Returns clip with speaker and talk.
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

    const [speaker, talk] = await Promise.all([
      clip.speakerId ? ctx.db.get('speakers', clip.speakerId) : null,
      clip.talkId ? ctx.db.get('talks', clip.talkId) : null,
    ]);

    return {
      clip,
      speaker,
      talk,
    };
  },
  returns: v.nullable(
    v.object({
      clip: doc('clips'),
      speaker: doc('speakers').nullable(),
      talk: doc('talks').nullable(),
    }),
  ),
});

const sortType = v.optional(
  v.union(v.literal('alphabetical'), v.literal('oldest'), v.literal('recent')),
);

/**
 * List published clips with speaker data (public-facing).
 * Supports filtering by search, speaker, and sorting.
 * Filters clips to only those with published parent talks.
 */
export const listClips = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    sort: sortType,
    speakerSlugs: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, search, sort = 'recent', speakerSlugs } = args;

    const hasSpeakerFilter = speakerSlugs && speakerSlugs.length > 0;
    const hasFilters = search || hasSpeakerFilter;
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

    // Apply speaker filter (multi-select)
    if (hasSpeakerFilter) {
      const speakers = await Promise.all(
        speakerSlugs.map((slug) => getOneFrom(ctx.db, 'speakers', 'by_slug', slug)),
      );
      const validSpeakers = speakers.filter((s): s is NonNullable<typeof s> => s !== null);
      const speakerIds = new Set(validSpeakers.map((s) => s._id));

      if (speakerIds.size > 0) {
        clips = clips.filter((clip) => clip.speakerId && speakerIds.has(clip.speakerId));
      } else {
        clips = []; // No matching speakers found
      }
    }

    // Apply sorting
    clips.sort(getContentComparator(sort as ContentSortOption));

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

    const clipPages =
      !status || status === 'all'
        ? await ctx.db.query('clips').order('desc').paginate(paginationOpts)
        : await ctx.db
            .query('clips')
            .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
            .order('desc')
            .paginate(paginationOpts);

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
