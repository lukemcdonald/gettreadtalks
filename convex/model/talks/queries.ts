import type { Doc } from '../../_generated/dataModel';

import { paginationOptsValidator, paginationResultValidator } from 'convex/server';
import { v } from 'convex/values';
import { getManyFrom, getManyVia, getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import {
  applySearchFilter,
  enrichWithSpeakers,
  paginateArray,
  shuffleAndLimit,
} from '../../lib/utils';
import { talkWithSpeakerValidator } from '../../lib/validators/query';
import { doc, docs } from '../../lib/validators/schema';
import { statusFilterType } from '../../lib/validators/shared';
import { canViewContent } from '../auth/roles';
import { getCurrentUser } from '../auth/utils';
import { enrichWithTopics } from './utils';

/**
 * Get talk by ID.
 */
export const getTalk = query({
  args: {
    id: v.id('talks'),
  },
  handler: async (ctx, args) => await ctx.db.get('talks', args.id),
  returns: doc('talks').nullable(),
});

/**
 * Get talk by speaker slug and talk slug with related data (default for detail pages).
 * Returns talk with speaker, collection, clips, and topics.
 */
export const getTalkBySlug = query({
  args: {
    speakerSlug: v.string(),
    talkSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    // First, get the speaker by slug
    const speaker = await getOneFrom(ctx.db, 'speakers', 'by_slug', args.speakerSlug);

    if (!speaker) {
      return null;
    }

    // Then, find the talk with the given slug for this speaker
    const talks = await ctx.db
      .query('talks')
      .withIndex('by_speakerId_and_status', (q) => q.eq('speakerId', speaker._id))
      .collect();

    const talk = talks.find((t) => t.slug === args.talkSlug);

    if (!talk) {
      return null;
    }

    if (!canViewContent(user, talk.status)) {
      return null;
    }

    const queries = {
      clips: ctx.db
        .query('clips')
        .withIndex('by_talkId_and_status', (q) =>
          q.eq('talkId', talk._id).eq('status', 'published'),
        )
        .collect(),
      collection: talk.collectionId ? ctx.db.get('collections', talk.collectionId) : null,
      topics: getManyVia(ctx.db, 'talksOnTopics', 'topicId', 'by_talkId', talk._id, 'talkId'),
    };

    const [clips, collection, topics] = await Promise.all([
      queries.clips,
      queries.collection,
      queries.topics,
    ]);

    const validTopics = topics.filter((topic) => topic !== null);

    return {
      clips,
      collection,
      speaker,
      talk,
      topics: validTopics,
    };
  },
  returns: v.nullable(
    v.object({
      clips: docs('clips'),
      collection: doc('collections').nullable(),
      speaker: doc('speakers').nullable(),
      talk: doc('talks'),
      topics: docs('topics'),
    }),
  ),
});

/**
 * Get total count of published talks.
 */
export const getTalksCount = query({
  args: {},
  handler: async (ctx) => {
    const talks = await getManyFrom(
      ctx.db,
      'talks',
      'by_status_and_publishedAt',
      'published',
      'status',
    );

    return talks.length;
  },
  returns: v.number(),
});

/**
 * Get featured talks (random selection).
 */
export const listFeaturedTalks = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 5 } = args;

    const talks = await ctx.db
      .query('talks')
      .withIndex('by_featured_and_status', (q) => q.eq('featured', true).eq('status', 'published'))
      .take(50);

    return shuffleAndLimit(talks, limit);
  },
  returns: docs('talks'),
});

/**
 * Get featured talks with speaker data.
 */
export const listFeaturedTalksWithSpeakers = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 5 } = args;

    const talks = await ctx.db
      .query('talks')
      .withIndex('by_featured_and_status', (q) => q.eq('featured', true).eq('status', 'published'))
      .take(50);

    const page = shuffleAndLimit(talks, limit);

    return await enrichWithSpeakers(ctx, page);
  },
  returns: v.array(talkWithSpeakerValidator),
});

/**
 * Get random talks by speaker (excluding a specific talk).
 */
export const listRandomTalksBySpeaker = query({
  args: {
    excludeTalkId: v.optional(v.string()),
    limit: v.optional(v.number()),
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    const { excludeTalkId, limit = 5, speakerId } = args;

    const talks = await ctx.db
      .query('talks')
      .withIndex('by_speakerId_and_status', (q) =>
        q.eq('speakerId', speakerId).eq('status', 'published'),
      )
      .collect();

    // Filter out excluded talk if provided
    const filteredTalks = excludeTalkId
      ? talks.filter((talk) => talk._id !== excludeTalkId)
      : talks;

    return shuffleAndLimit(filteredTalks, limit);
  },
  returns: docs('talks'),
});

/**
 * Get talks by collection with status filter. Returns talks sorted by collection order.
 */
export const listTalksByCollection = query({
  args: {
    collectionId: v.id('collections'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { collectionId, limit = 100 } = args;

    const talks = await ctx.db
      .query('talks')
      .withIndex('by_collectionId_and_status', (q) =>
        q.eq('collectionId', collectionId).eq('status', 'published'),
      )
      .take(limit);

    const sortedTalks = talks.sort((a, b) => (a.collectionOrder || 0) - (b.collectionOrder || 0));

    return sortedTalks;
  },
  returns: docs('talks'),
});

/**
 * Get talks by speaker with status filter.
 */
export const listTalksBySpeaker = query({
  args: {
    limit: v.optional(v.number()),
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    const { limit = 20, speakerId } = args;

    return await ctx.db
      .query('talks')
      .withIndex('by_speakerId_and_status', (q) =>
        q.eq('speakerId', speakerId).eq('status', 'published'),
      )
      .order('desc')
      .take(limit);
  },
  returns: docs('talks'),
});

/**
 * List published talks with speaker data.
 *
 * @param paginationOpts - Pagination options
 */
export const listTalks = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { paginationOpts } = args;

    const result = await ctx.db
      .query('talks')
      .withIndex('by_status_and_publishedAt', (q) => q.eq('status', 'published'))
      .order('desc')
      .paginate(paginationOpts);

    const talksWithSpeakers = await enrichWithSpeakers(ctx, result.page);
    const enrichedTalks = await enrichWithTopics(ctx, talksWithSpeakers);

    return {
      ...result,
      page: enrichedTalks,
    };
  },
  returns: paginationResultValidator(
    talkWithSpeakerValidator.extend({
      topicSlugs: v.array(v.string()),
    }),
  ),
});

/**
 * List all talks with speaker data and filtering support.
 * Supports status='all' to fetch talks across all statuses.
 *
 * @param status - Filter by status or 'all' for all statuses (defaults to 'published')
 * @param search - Search by title (optional)
 * @param paginationOpts - Pagination options
 */
export const listAllTalks = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    status: v.optional(statusFilterType),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, search, status = 'published' } = args;

    // Search requires in-memory filtering, can't use .paginate()
    let talks: Doc<'talks'>[];

    if (status === 'all') {
      talks = await ctx.db.query('talks').order('desc').collect();
    } else {
      talks = await ctx.db
        .query('talks')
        .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
        .order('desc')
        .collect();
    }

    if (search) {
      talks = applySearchFilter(talks, search);
    }

    const { continueCursor, isDone, page } = paginateArray(
      talks,
      paginationOpts.cursor,
      paginationOpts.numItems,
    );

    const talksWithSpeakers = await enrichWithSpeakers(ctx, page);
    const talksWithSpeakersAndTopics = await enrichWithTopics(ctx, talksWithSpeakers);

    return {
      continueCursor,
      isDone,
      page: talksWithSpeakersAndTopics,
    };
  },
  returns: paginationResultValidator(
    v.object({
      ...doc('talks').fields,
      speaker: doc('speakers').nullable(),
      topicSlugs: v.array(v.string()),
    }),
  ),
});
