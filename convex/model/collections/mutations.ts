import type { MutationCtx } from '../../_generated/server';
import type { ObjectType } from 'convex/values';

import { Doc, Id } from '../../_generated/dataModel';
import { normalizeSlug, slugExists } from '../../lib/utils';
import { requireAuth } from '../auth/queries';
import { createCollectionArgs, updateCollectionArgs } from './validators';

/**
 * Create a new collection.
 *
 * @param ctx - Database context
 * @param args - Collection creation arguments
 * @returns The ID of the created collection
 */
export async function createCollection(
  ctx: MutationCtx,
  args: ObjectType<typeof createCollectionArgs>,
) {
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
export async function updateCollection(
  ctx: MutationCtx,
  args: ObjectType<typeof updateCollectionArgs>,
) {
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
