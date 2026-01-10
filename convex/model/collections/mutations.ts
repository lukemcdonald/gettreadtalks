import type { Doc } from '../../_generated/dataModel';

import { v } from 'convex/values';
import { getOneFrom } from 'convex-helpers/server/relationships';

import { mutation } from '../../_generated/server';
import { throwNotFound, throwValidationError } from '../../lib/errors';
import { generateSlug } from '../../lib/utils';
import { requireAuth } from '../auth/utils';

/**
 * Create a new collection.
 */
export const createCollection = mutation({
  args: {
    description: v.optional(v.string()),
    title: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    if (!args.title.trim()) {
      throwValidationError('Title cannot be empty', 'title');
    }

    const slug = await generateSlug(ctx, 'collections', args.title);

    return await ctx.db.insert('collections', {
      ...args,
      slug,
    });
  },
  returns: v.id('collections'),
});

/**
 * Destroy a collection (permanently delete from database with reference checks).
 */
export const destroyCollection = mutation({
  args: {
    collectionId: v.id('collections'),
  },
  handler: async (ctx, args) => {
    const { collectionId } = args;

    await requireAuth(ctx);

    const collection = await ctx.db.get('collections', collectionId);

    if (!collection) {
      throwNotFound('Collection not found', {
        resource: 'collection',
        resourceId: collectionId,
      });
    }

    // Check if collection is referenced by any talks
    const talksWithCollection = await getOneFrom(
      ctx.db,
      'talks',
      'by_collectionId_and_status',
      collectionId,
      'collectionId',
    );

    if (talksWithCollection) {
      throwValidationError('Cannot delete collection: collection has associated talks');
    }

    // Hard delete the collection
    await ctx.db.delete(collectionId);

    return null;
  },
  returns: v.null(),
});

/**
 * Update an existing collection.
 */
export const updateCollection = mutation({
  args: {
    collectionId: v.id('collections'),
    description: v.optional(v.string()),
    title: v.optional(v.string()),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // TODO: Do we really need to destruction collectionId from rest
    const { collectionId, ...rest } = args;

    await requireAuth(ctx);

    const updates: Partial<Doc<'collections'>> = rest;
    const collection: Doc<'collections'> | null = await ctx.db.get('collections', collectionId);

    if (!collection) {
      throwNotFound('Collection not found', {
        resource: 'collection',
        resourceId: collectionId,
      });
    }

    if (updates.title !== undefined) {
      if (!updates.title.trim()) {
        throwValidationError('Title cannot be empty', 'title');
      }

      const newSlug = await generateSlug(ctx, 'collections', updates.title, collectionId);

      if (newSlug !== collection.slug) {
        updates.slug = newSlug;
      }
    }

    updates.updatedAt = Date.now();

    await ctx.db.patch(collectionId, updates);

    return collectionId;
  },
  returns: v.id('collections'),
});
