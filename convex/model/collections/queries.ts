import type { Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { ObjectType } from 'convex/values';

import {
  getCollectionArgs,
  getCollectionBySlugArgs,
  getCollectionWithTalksArgs,
  listCollectionsArgs,
} from './validators';

/**
 * Get collection by ID.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Collection or null if not found
 */
export async function getCollection(ctx: QueryCtx, args: ObjectType<typeof getCollectionArgs>) {
  return await ctx.db.get(args.id);
}

/**
 * Get collection by slug.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Collection or null if not found
 */
export async function getCollectionBySlug(
  ctx: QueryCtx,
  args: ObjectType<typeof getCollectionBySlugArgs>,
) {
  return await ctx.db
    .query('collections')
    .withIndex('by_slug', (q) => q.eq('slug', args.slug))
    .unique();
}

/**
 * Get collections.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of collections
 */
export async function getCollections(ctx: QueryCtx, args: ObjectType<typeof listCollectionsArgs>) {
  const { limit = 100 } = args;

  return await ctx.db.query('collections').take(limit);
}

/**
 * Get collection with its talks.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Collection with its talks
 */
export async function getCollectionWithTalks(
  ctx: QueryCtx,
  args: ObjectType<typeof getCollectionWithTalksArgs>,
) {
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
