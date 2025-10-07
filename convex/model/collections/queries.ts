import type { QueryCtx } from '../../_generated/server';

/**
 * Get collection by slug.
 *
 * @param ctx - Database context
 * @param slug - Collection slug
 * @returns Collection or null if not found
 */
export async function getBySlug(ctx: QueryCtx, slug: string) {
  return await ctx.db
    .query('collections')
    .withIndex('by_slug', (q) => q.eq('slug', slug))
    .unique();
}

/**
 * Get collection with its talks.
 *
 * @param ctx - Database context
 * @param slug - Collection slug
 * @param limit - Maximum number of talks to fetch
 * @returns Collection with its talks
 */
export async function getWithTalks(ctx: QueryCtx, slug: string, limit: number = 100) {
  const collection = await getBySlug(ctx, slug);

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
