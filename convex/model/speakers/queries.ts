import type { Doc } from '../../_generated/dataModel';
import type { SpeakerSortOption } from '../../lib/sort';

import { paginationOptsValidator, paginationResultValidator } from 'convex/server';
import { v } from 'convex/values';
import { getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { filterSpeakersWithPublishedTalks } from '../../lib/filters';
import { rotateContent } from '../../lib/rotateContent';
import { getSpeakerComparator } from '../../lib/sort';
import { paginateArray } from '../../lib/utils';
import { doc, docs } from '../../lib/validators/schema';
import { speakerRoleType } from './validators';

const speakerPageValidator = paginationResultValidator(doc('speakers'));

/**
 * Get speaker by ID.
 */
export const getSpeaker = query({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => await ctx.db.get('speakers', args.speakerId),
  returns: doc('speakers').nullable(),
});

/**
 * Get speaker by slug with related data (default for detail pages).
 * Returns speaker with related talks, collections, and clips.
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

    const [talks, clips] = await Promise.all([
      ctx.db
        .query('talks')
        .withIndex('by_speakerId_and_status', (q) =>
          q.eq('speakerId', speakerId).eq('status', 'published'),
        )
        .order('desc')
        .collect(),
      ctx.db
        .query('clips')
        .withIndex('by_speakerId_and_status', (q) =>
          q.eq('speakerId', speakerId).eq('status', 'published'),
        )
        .order('desc')
        .collect(),
    ]);

    const collectionIds = [
      ...new Set(talks.flatMap((talk) => (talk.collectionId ? [talk.collectionId] : []))),
    ];
    const collectionsData = await Promise.all(
      collectionIds.map((id) => ctx.db.get('collections', id)),
    );
    const collections = collectionsData.filter((col): col is Doc<'collections'> => col !== null);

    return {
      clips,
      collections,
      speaker,
      talks,
    };
  },
  returns: v.nullable(
    v.object({
      clips: docs('clips'),
      collections: docs('collections'),
      speaker: doc('speakers'),
      talks: docs('talks'),
    }),
  ),
});

/**
 * List all speakers without pagination (for migration/cleanup scripts).
 */
export const listAllSpeakersRaw = query({
  args: {},
  handler: async (ctx) => await ctx.db.query('speakers').collect(),
  returns: docs('speakers'),
});

/**
 * Get total count of speakers.
 */
export const getSpeakersCount = query({
  args: {},
  handler: async (ctx) => {
    const speakers = await ctx.db.query('speakers').collect();

    return speakers.length;
  },
  returns: v.number(),
});

/**
 * Get featured speakers with daily rotation.
 */
export const listFeaturedSpeakers = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 6 } = args;

    // Intentionally unbounded: Need all featured speakers for rotation
    // Limited to 50 to prevent memory issues if featured speakers grow
    const speakers = await ctx.db
      .query('speakers')
      .withIndex('by_featured', (q) => q.eq('featured', true))
      .take(50);

    return rotateContent(speakers, { count: limit, period: 'daily' });
  },
  returns: docs('speakers'),
});

/**
 * List speakers with pagination and optional filtering.
 * Filters to speakers who have at least one published talk or clip.
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

    const hasFilters = search || role;
    const needsCustomSort = sort !== 'alphabetical';

    // When no filters and default sort, use native Convex pagination
    if (!(hasFilters || needsCustomSort)) {
      const result = await ctx.db
        .query('speakers')
        .withIndex('by_lastName')
        .order('asc')
        .paginate(paginationOpts);

      const filtered = await filterSpeakersWithPublishedTalks(ctx, result.page);

      return {
        ...result,
        page: filtered,
      };
    }

    // With filters or custom sort, collect all and paginate in-memory
    let speakers = await ctx.db.query('speakers').withIndex('by_lastName').order('asc').collect();

    // Filter to speakers with published content
    speakers = await filterSpeakersWithPublishedTalks(ctx, speakers);

    // Filter by search term (firstName, lastName)
    if (search) {
      const searchLower = search.toLowerCase();
      speakers = speakers.filter(
        (speaker) =>
          speaker.firstName.toLowerCase().includes(searchLower) ||
          speaker.lastName.toLowerCase().includes(searchLower) ||
          `${speaker.firstName} ${speaker.lastName}`.toLowerCase().includes(searchLower),
      );
    }

    // Filter by role
    if (role) {
      speakers = speakers.filter((speaker) => speaker.role === role);
    }

    // Sort using comparator
    speakers.sort(getSpeakerComparator(sort as SpeakerSortOption));

    const { continueCursor, isDone, page } = paginateArray(
      speakers,
      paginationOpts.cursor,
      paginationOpts.numItems,
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
 * List all speakers with pagination.
 * Returns all speakers without filtering.
 */
export const listAllSpeakers = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const speakerPages = await ctx.db
      .query('speakers')
      .withIndex('by_lastName')
      .order('asc')
      .paginate(args.paginationOpts);

    return speakerPages;
  },
  returns: speakerPageValidator,
});
