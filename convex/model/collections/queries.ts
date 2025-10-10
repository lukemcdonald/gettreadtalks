import type { PaginationOptions } from 'convex/server';
import type { QueryCtx } from '../../_generated/server';

import type {
  GetCollectionArgs,
  GetCollectionBySlugArgs,
  GetCollectionWithTalksArgs,
  ListCollectionsArgs,
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
  return await ctx.db
    .query('collections')
    .withIndex('by_slug', (q) => q.eq('slug', args.slug))
    .unique();
}

/**
 * Get collections with pagination.
 *
 * @param ctx - Database context
 * @param args - Query arguments with pagination options
 * @returns Paginated collections
 */
export async function getCollections(
  ctx: QueryCtx,
  args: { paginationOpts: PaginationOptions },
) {
  return await ctx.db.query('collections').order('desc').paginate(args.paginationOpts);
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
