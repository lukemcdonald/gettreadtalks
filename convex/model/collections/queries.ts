import type { Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';

/**
 * Get collection by ID.
 *
 * @param ctx - Database context
 * @param id - Collection ID
 * @returns Collection or null if not found
 */
export async function getCollection(ctx: QueryCtx, id: Id<'collections'>) {
  return await ctx.db.get(id);
}

/**
 * Get collection by slug.
 *
 * @param ctx - Database context
 * @param slug - Collection slug
 * @returns Collection or null if not found
 */
export async function getCollectionBySlug(ctx: QueryCtx, slug: string) {
  return await ctx.db
    .query('collections')
    .withIndex('by_slug', (q) => q.eq('slug', slug))
    .unique();
}

/**
 * Get collections.
 *
 * @param ctx - Database context
 * @param limit - Maximum number of results
 * @returns Array of collections
 */
export async function getCollections(ctx: QueryCtx, limit: number = 100) {
  return await ctx.db.query('collections').take(limit);
}

/**
 * Get collection with its talks.
 *
 * @param ctx - Database context
 * @param slug - Collection slug
 * @param limit - Maximum number of talks to fetch
 * @returns Collection with its talks
 */
export async function getCollectionWithTalks(ctx: QueryCtx, slug: string, limit: number = 100) {
  const collection = await getCollectionBySlug(ctx, slug);

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
