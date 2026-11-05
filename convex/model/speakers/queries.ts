import type { Doc } from '../../_generated/dataModel';
import type { SpeakerSortOption } from '../../lib/sort';

import { getOneFrom } from 'convex-helpers/server/relationships';
import {
  paginationOptsValidator,
  paginationResultValidator,
} from 'convex/server';
import { v } from 'convex/values';

import { query } from '../../_generated/server';
import {
  filterClipsWithPublishedTalk,
  filterSpeakersWithPublicContent,
} from '../../lib/filters';
import { rotateContent } from '../../lib/rotateContent';
import { byPublishedAt, getSpeakerComparator } from '../../lib/sort';
import { paginateArray, toPublicTalk } from '../../lib/utils';
import { doc, docs } from '../../lib/validators/schema';
import { publishState } from '../../lib/validators/shared';
import { requireAdmin } from '../auth/helpers';
import {
  LIST_SEARCH_LIMIT,
  adminListArgs,
  normalizeSearchQuery,
} from '../search/helpers';
import { listPublishedTopicsForTalks } from '../topics/helpers';
import {
  listPublishedSpeakers,
  listPublishedSpeakersPage,
  listSpeakersForAdmin,
  searchPublishedSpeakers,
} from './helpers';
import { speakerRoleType } from './validators';

const speakerPageValidator = paginationResultValidator(doc('speakers'));

const speakerAdminPageValidator = paginationResultValidator(
  v.object({
    clipCount: v.number(),
    speaker: doc('speakers'),
    status: publishState,
    talkCount: v.number(),
  })
);

/**
 * Get speaker by ID.
 */
export const getSpeaker = query({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return await ctx.db.get('speakers', args.speakerId);
  },
  returns: doc('speakers').nullable(),
});

/**
 * Get speaker by slug with related data (default for detail pages).
 * Returns speaker with related talks, collections, clips, and topics.
 */
export const getSpeakerBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const speaker = await getOneFrom(ctx.db, 'speakers', 'by_slug', args.slug);

    if (!speaker) {
      return null;
    }

    const { _id: speakerId } = speaker;

    const [talks, clipRows] = await Promise.all([
      ctx.db
        .query('talks')
        .withIndex('by_speakerId_and_status', (q) =>
          q.eq('speakerId', speakerId).eq('status', 'published')
        )
        .collect()
        .then((rows) =>
          rows.toSorted((left, right) => byPublishedAt(left, right, 'desc'))
        ),
      ctx.db
        .query('clips')
        .withIndex('by_speakerId_and_status', (q) =>
          q.eq('speakerId', speakerId).eq('status', 'published')
        )
        .order('desc')
        .collect(),
    ]);
    const clips = await filterClipsWithPublishedTalk(ctx, clipRows);

    const collectionIds = [
      ...new Set(
        talks.flatMap((talk) => (talk.collectionId ? [talk.collectionId] : []))
      ),
    ];
    const [collectionsData, topics] = await Promise.all([
      Promise.all(collectionIds.map((id) => ctx.db.get('collections', id))),
      listPublishedTopicsForTalks(
        ctx,
        talks.map((talk) => talk._id)
      ),
    ]);
    const collections = collectionsData.filter(
      (col): col is Doc<'collections'> => col !== null
    );

    return {
      clips,
      collections,
      speaker,
      talks: talks.map((talk) => toPublicTalk(talk)),
      topics,
    };
  },
  returns: v.nullable(
    v.object({
      clips: docs('clips'),
      collections: docs('collections'),
      speaker: doc('speakers'),
      talks: docs('talks'),
      topics: docs('topics'),
    })
  ),
});

/**
 * List slugs for speakers with a published talk or a public clip.
 */
export const listSpeakerSlugs = query({
  args: {},
  handler: async (ctx) => {
    const speakers = await listPublishedSpeakers(ctx);

    return speakers.map((speaker) => ({
      slug: speaker.slug,
      updatedAt: speaker.updatedAt ?? speaker._creationTime,
    }));
  },
  returns: v.array(
    v.object({
      slug: v.string(),
      updatedAt: v.number(),
    })
  ),
});

/**
 * Get total count of speakers.
 */
export const getSpeakersCount = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const speakers = await ctx.db.query('speakers').collect();

    return speakers.length;
  },
  returns: v.number(),
});

const FEATURED_SPEAKER_POOL = 50;

/**
 * Get featured speakers with daily rotation.
 */
export const listFeaturedSpeakers = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 6 } = args;
    const pool: Doc<'speakers'>[] = [];
    const featured = ctx.db
      .query('speakers')
      .withIndex('by_featured', (q) => q.eq('featured', true));

    for await (const speaker of featured) {
      // oxlint-disable-next-line no-await-in-loop -- stop once the rotation pool is full
      const [visible] = await filterSpeakersWithPublicContent(ctx, [speaker]);

      if (visible) {
        pool.push(visible);
      }

      if (pool.length >= FEATURED_SPEAKER_POOL) {
        break;
      }
    }

    return rotateContent(pool, { count: limit, period: 'daily' });
  },
  returns: docs('speakers'),
});

/**
 * List speakers with pagination and optional filtering.
 * Filters to speakers who have at least one published talk or public clip.
 */
export const listSpeakers = query({
  args: {
    paginationOpts: paginationOptsValidator,
    role: v.optional(speakerRoleType),
    search: v.optional(v.string()),
    sort: v.optional(v.union(v.literal('alphabetical'), v.literal('featured'))),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, role, search, sort = 'alphabetical' } = args;

    const queryText = normalizeSearchQuery(search ?? '');
    const hasSearch = queryText.length > 0;
    const hasFilters = hasSearch || role;
    const needsCustomSort = sort !== 'alphabetical';

    // When no filters and default sort, use native Convex pagination
    if (!(hasFilters || needsCustomSort)) {
      return await listPublishedSpeakersPage(ctx, paginationOpts);
    }

    let speakers = hasSearch
      ? await searchPublishedSpeakers(ctx, queryText, LIST_SEARCH_LIMIT)
      : await listPublishedSpeakers(ctx);

    // Filter by role
    if (role) {
      speakers = speakers.filter((speaker) => speaker.role === role);
    }

    // Sort using comparator
    speakers.sort(getSpeakerComparator(sort as SpeakerSortOption));

    const { continueCursor, isDone, page } = paginateArray(
      speakers,
      paginationOpts.cursor,
      paginationOpts.numItems
    );

    return {
      continueCursor,
      isDone,
      page,
    };
  },
  returns: speakerPageValidator,
});

/**
 * List speakers for admin use, with talk and clip counts.
 * Omitted status means published. Pass status='all' for every speaker.
 */
export const listAllSpeakers = query({
  args: adminListArgs,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return await listSpeakersForAdmin(ctx, {
      paginationOpts: args.paginationOpts,
      search: args.search,
      status: args.status ?? 'published',
    });
  },
  returns: speakerAdminPageValidator,
});
