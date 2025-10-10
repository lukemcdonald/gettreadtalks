import type { MutationCtx } from '../../_generated/server';

import { Doc } from '../../_generated/dataModel';
import { normalizeSlug, slugExists } from '../../lib/utils';
import { requireAuth } from '../auth/queries';
import type { CreateCollectionArgs, DestroyCollectionArgs, UpdateCollectionArgs } from './types';

/**
 * Create a new collection.
 *
 * @param ctx - Database context
 * @param args - Collection creation arguments
 * @returns The ID of the created collection
 */
export async function createCollection(ctx: MutationCtx, args: CreateCollectionArgs) {
  await requireAuth(ctx);

  const slug = normalizeSlug(args.title);

  if (await slugExists(ctx, 'collections', slug)) {
    throw new Error('Collection with this title already exists');
  }

  return await ctx.db.insert('collections', {
    ...args,
    slug,
  });
}

/**
 * Update an existing collection.
 *
 * @param ctx - Database context
 * @param args - Update arguments
 * @returns The ID of the updated collection
 */
export async function updateCollection(ctx: MutationCtx, args: UpdateCollectionArgs) {
  await requireAuth(ctx);

  const { id, ...rest } = args;
  const updates: Partial<Doc<'collections'>> = rest;
  const collection: Doc<'collections'> | null = await ctx.db.get(id);

  if (!collection) {
    throw new Error('Collection not found');
  }

  if (updates.title) {
    const newSlug = normalizeSlug(updates.title);

    if (newSlug !== collection.slug) {
      if (await slugExists(ctx, 'collections', newSlug, id)) {
        throw new Error('Collection with this title already exists');
      }

      updates.slug = newSlug;
    }
  }

  updates.updatedAt = Date.now();

  await ctx.db.patch(id, updates);

  return id;
}

/**
 * Destroy a collection (permanently delete from database with reference checks).
 *
 * @param ctx - Database context
 * @param args - Destroy arguments
 * @returns null
 */
export async function destroyCollection(ctx: MutationCtx, args: DestroyCollectionArgs) {
  await requireAuth(ctx);

  const collection = await ctx.db.get(args.id);

  if (!collection) {
    throw new Error('Collection not found');
  }

  // Check if collection is referenced by any talks
  const talksWithCollection = await ctx.db
    .query('talks')
    .withIndex('by_collection_id_and_status', (q) => q.eq('collectionId', args.id))
    .first();

  if (talksWithCollection) {
    throw new Error('Cannot delete collection: collection has associated talks');
  }

  // Hard delete the collection
  await ctx.db.delete(args.id);

  return null;
}
