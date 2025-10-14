import type { PaginationOptions } from 'convex/server';
import { asyncMap } from 'convex-helpers';
import { getAll, getOneFrom } from 'convex-helpers/server/relationships';

import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type {
  GetCollectionArgs,
  GetCollectionBySlugArgs,
  GetCollectionWithTalksArgs,
} from './types';

/**
 * Get collection by ID.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Collection or null if not found
 */
export async function getCollection(ctx: QueryCtx, args: GetCollectionArgs) {
  return await ctx.db.get(args.id);
}

/**
 * Get collection by slug.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Collection or null if not found
 */
export async function getCollectionBySlug(ctx: QueryCtx, args: GetCollectionBySlugArgs) {
  return await getOneFrom(ctx.db, 'collections', 'by_slug', args.slug);
}

/**
 * Get collections with pagination.
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated collections
 */
export async function getCollections(ctx: QueryCtx, args: { paginationOpts: PaginationOptions }) {
  return await ctx.db.query('collections').order('desc').paginate(args.paginationOpts);
}

/**
 * Get collections with stats (talk counts and speakers).
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated collections with talk counts and speakers
 */
export async function getCollectionsWithStats(
  ctx: QueryCtx,
  args: { paginationOpts: PaginationOptions },
) {
  const result = await ctx.db.query('collections').order('desc').paginate(args.paginationOpts);

  // Enrich each collection with stats
  const enrichedPage = await asyncMap(result.page, async (collection: Doc<'collections'>) => {
    const talks = await ctx.db
      .query('talks')
      .withIndex('by_collection_id_and_status', (q) =>
        q.eq('collectionId', collection._id).eq('status', 'published'),
      )
      .collect();

    // Get unique speaker IDs
    const speakerIds = [...new Set(talks.map((talk) => talk.speakerId))];

    // Fetch speakers in parallel
    const speakers = await getAll(ctx.db, speakerIds);
    const validSpeakers = speakers.filter((speaker) => speaker !== null);

    return {
      collection,
      speakers: validSpeakers,
      talkCount: talks.length,
    };
  });

  return {
    ...result,
    page: enrichedPage,
  };
}

/**
 * Get collection with its talks.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Collection with its talks
 */
export async function getCollectionWithTalks(ctx: QueryCtx, args: GetCollectionWithTalksArgs) {
  const { limit = 100, slug } = args;

  const collection = await getCollectionBySlug(ctx, { slug });

  if (!collection) {
    return null;
  }

  const talks = await ctx.db
    .query('talks')
    .withIndex('by_collection_id_and_status', (q) =>
      q.eq('collectionId', collection._id).eq('status', 'published'),
    )
    .take(limit);

  // Sort by collectionOrder
  talks.sort((a, b) => (a.collectionOrder || 0) - (b.collectionOrder || 0));

  return {
    collection,
    talks,
  };
}

/**
 * Get collection with unique speakers from its talks.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Collection with array of unique speakers
 */
export async function getCollectionWithSpeakers(ctx: QueryCtx, args: { slug: string }) {
  const collection = await getCollectionBySlug(ctx, { slug: args.slug });

  if (!collection) {
    return null;
  }

  const talks = await ctx.db
    .query('talks')
    .withIndex('by_collection_id_and_status', (q) =>
      q.eq('collectionId', collection._id).eq('status', 'published'),
    )
    .collect();

  // Get unique speaker IDs
  const speakerIds = [...new Set(talks.map((talk) => talk.speakerId))];

  // Fetch all speakers in parallel
  const speakers = await getAll(ctx.db, speakerIds);

  // Filter out null speakers
  const validSpeakers = speakers.filter((speaker) => speaker !== null);

  return {
    collection,
    speakers: validSpeakers,
  };
}

/**
 * Get collections by speaker.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Array of collections that contain talks by the speaker
 */
export async function getCollectionsBySpeaker(ctx: QueryCtx, args: { speakerId: Id<'speakers'> }) {
  // Get all published talks by speaker
  const talks = await ctx.db
    .query('talks')
    .withIndex('by_speaker_id_and_status', (q) =>
      q.eq('speakerId', args.speakerId).eq('status', 'published'),
    )
    .collect();

  // Get unique collection IDs (filter out talks without collections)
  const collectionIds = [
    ...new Set(talks.filter((talk) => talk.collectionId).map((talk) => talk.collectionId!)),
  ];

  // Fetch all collections in parallel
  const collections = await getAll(ctx.db, collectionIds);

  // Filter out null collections
  const validCollections = collections.filter((collection) => collection !== null);

  return validCollections;
}
