import { asyncMap } from 'convex-helpers';
import { getAll, getOneFrom } from 'convex-helpers/server/relationships';
import {
  paginationOptsValidator,
  paginationResultValidator,
} from 'convex/server';
import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { enrichWithSpeaker, paginateSearchOrList } from '../../lib/utils';
import { talkWithSpeakerValidator } from '../../lib/validators/query';
import { doc, docs } from '../../lib/validators/schema';
import { requireAdmin } from '../auth/roles';
import { LIST_SEARCH_LIMIT } from '../search/constants';
import { normalizeSearchQuery } from '../search/utils';
import { listPublishedTalksForCollection } from '../talks/helpers';
import {
  enrichCollectionsForAdmin,
  listPublishedCollections,
  listPublishedCollectionsPage,
  loadSpeakersForTalks,
  searchCollections,
} from './helpers';

/**
 * List slugs for collections with published talks.
 */
export const listCollectionSlugs = query({
  args: {},
  handler: async (ctx) => {
    const collections = await listPublishedCollections(ctx);

    return collections.map((collection) => ({
      slug: collection.slug,
      updatedAt: collection.updatedAt ?? collection._creationTime,
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
 * Get collection by ID.
 */
export const getCollection = query({
  args: {
    collectionId: v.id('collections'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return await ctx.db.get('collections', args.collectionId);
  },
  returns: doc('collections').nullable(),
});

/**
 * Get collection by slug with related data (default for detail pages).
 * Returns collection with its talks (each with speaker).
 */
export const getCollectionBySlug = query({
  args: {
    limit: v.optional(v.number()),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const { limit = 100, slug } = args;

    const collection = await getOneFrom(ctx.db, 'collections', 'by_slug', slug);

    if (!collection) {
      return null;
    }

    const talks = await listPublishedTalksForCollection(
      ctx,
      collection._id,
      limit
    );

    if (talks.length === 0) {
      return null;
    }

    talks.sort((a, b) => (a.collectionOrder || 0) - (b.collectionOrder || 0));

    const talksWithSpeakers = await enrichWithSpeaker(ctx, talks);

    return {
      collection,
      talks: talksWithSpeakers,
    };
  },
  returns: v.nullable(
    v.object({
      collection: doc('collections'),
      talks: v.array(talkWithSpeakerValidator),
    })
  ),
});

/**
 * List collections by speaker. Returns collections that contain talks by the speaker.
 */
export const listCollectionsBySpeaker = query({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    // Get all published talks by speaker
    const talks = await ctx.db
      .query('talks')
      .withIndex('by_speakerId_and_status', (q) =>
        q.eq('speakerId', args.speakerId).eq('status', 'published')
      )
      .collect();

    // Get unique collection IDs (filter out talks without collections)
    const collectionIds = [
      ...new Set(
        talks.flatMap((talk) => (talk.collectionId ? [talk.collectionId] : []))
      ),
    ];
    const collections = await getAll(ctx.db, collectionIds);
    const validCollections = collections.filter(
      (collection) => collection !== null
    );

    return validCollections;
  },
  returns: docs('collections'),
});

/**
 * List collections with stats (public-facing).
 * Filters to only collections with published talks.
 */
export const listCollections = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const collectionPages = await listPublishedCollectionsPage(
      ctx,
      args.paginationOpts
    );

    // Enrich each collection with stats
    const enrichedPage = await asyncMap(
      collectionPages.page,
      async (collection) => {
        const talks = await listPublishedTalksForCollection(
          ctx,
          collection._id
        );

        return {
          collection,
          speakers: await loadSpeakersForTalks(ctx, talks),
          talkCount: talks.length,
        };
      }
    );

    return {
      ...collectionPages,
      page: enrichedPage,
    };
  },
  // PaginationResult with enriched page: Array<{ collection, speakers, talkCount }>
  returns: v.any(),
});

const collectionAdminPageValidator = paginationResultValidator(
  v.object({
    collection: doc('collections'),
    speakers: docs('speakers'),
    status: v.union(v.literal('draft'), v.literal('published')),
    talkCount: v.number(),
  })
);

/**
 * List all collections with stats.
 * Returns all collections without filtering.
 */
export const listAllCollections = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const queryText = normalizeSearchQuery(args.search ?? '');
    const result = await paginateSearchOrList({
      listPage: () =>
        ctx.db.query('collections').order('desc').paginate(args.paginationOpts),
      paginationOpts: args.paginationOpts,
      queryText,
      search: () => searchCollections(ctx, queryText, LIST_SEARCH_LIMIT),
    });

    return {
      ...result,
      page: await enrichCollectionsForAdmin(ctx, result.page),
    };
  },
  returns: collectionAdminPageValidator,
});
