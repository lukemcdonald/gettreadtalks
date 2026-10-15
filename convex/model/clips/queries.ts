import type { ContentSortOption } from '../../lib/sort';

import { getOneFrom } from 'convex-helpers/server/relationships';
import {
  paginationOptsValidator,
  paginationResultValidator,
} from 'convex/server';
import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { getContentComparator } from '../../lib/sort';
import { paginateArray } from '../../lib/utils';
import { doc, docs } from '../../lib/validators/schema';
import { statusFilterType } from '../../lib/validators/shared';
import { canViewContent } from '../auth/roles';
import { getCurrentUser } from '../auth/utils';
import { LIST_SEARCH_LIMIT } from '../search/constants';
import { normalizeSearchQuery } from '../search/utils';
import {
  enrichClipsWithSpeaker,
  listPublishedClips,
  listPublishedClipsPage,
  searchPublishedClips,
} from './helpers';

const clipPageWithSpeakersValidator = paginationResultValidator(
  doc('clips').extend({
    speaker: doc('speakers').nullable(),
  })
);

/**
 * List slugs for published clips whose parent talk is published or standalone.
 */
export const listClipSlugsForSitemap = query({
  args: {},
  handler: async (ctx) => {
    const clips = await listPublishedClips(ctx);

    return clips.map((clip) => ({
      slug: clip.slug,
      updatedAt: clip.updatedAt ?? clip._creationTime,
    }));
  },
  returns: v.array(v.object({ slug: v.string(), updatedAt: v.number() })),
});

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
    })
  ),
});

const sortType = v.optional(
  v.union(v.literal('alphabetical'), v.literal('oldest'), v.literal('recent'))
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

    const queryText = normalizeSearchQuery(search ?? '');
    const hasSearch = queryText.length > 0;
    const hasSpeakerFilter = speakerSlugs && speakerSlugs.length > 0;
    const hasFilters = hasSearch || hasSpeakerFilter;
    const needsCustomSort = sort !== 'recent';

    // When no filters and default sort, use native Convex pagination
    if (!(hasFilters || needsCustomSort)) {
      const clipPages = await listPublishedClipsPage(ctx, paginationOpts);

      return {
        ...clipPages,
        page: await enrichClipsWithSpeaker(ctx, clipPages.page),
      };
    }

    let clips = hasSearch
      ? await searchPublishedClips(ctx, queryText, LIST_SEARCH_LIMIT)
      : await listPublishedClips(ctx);

    // Apply speaker filter (multi-select)
    if (hasSpeakerFilter) {
      const speakers = await Promise.all(
        speakerSlugs.map((slug) =>
          getOneFrom(ctx.db, 'speakers', 'by_slug', slug)
        )
      );
      const validSpeakers = speakers.filter(
        (s): s is NonNullable<typeof s> => s !== null
      );
      const speakerIds = new Set(validSpeakers.map((s) => s._id));

      // No matching speakers found
      clips =
        speakerIds.size > 0
          ? clips.filter(
              (clip) => clip.speakerId && speakerIds.has(clip.speakerId)
            )
          : [];
    }

    // Apply sorting
    clips.sort(getContentComparator(sort as ContentSortOption));

    const { continueCursor, isDone, page } = paginateArray(
      clips,
      paginationOpts.cursor,
      paginationOpts.numItems
    );

    return {
      continueCursor,
      isDone,
      page: await enrichClipsWithSpeaker(ctx, page),
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
        q.eq('speakerId', speakerId).eq('status', 'published')
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
            .withIndex('by_status_and_publishedAt', (q) =>
              q.eq('status', status)
            )
            .order('desc')
            .paginate(paginationOpts);

    return {
      ...clipPages,
      page: await enrichClipsWithSpeaker(ctx, clipPages.page),
    };
  },
  returns: clipPageWithSpeakersValidator,
});
