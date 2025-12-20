import type { Doc } from '../../_generated/dataModel';

import { v } from 'convex/values';
import { getOneFrom } from 'convex-helpers/server/relationships';

import { mutation } from '../../_generated/server';
import { throwNotFound, throwValidationError } from '../../lib/errors';
import { generateSlug } from '../../lib/utils';
import { requireAuth } from '../auth/utils';

/**
 * Create a new collection.
 *
 * @param ctx - Database context
 * @param args - Collection creation arguments
 * @returns The ID of the created collection
 */
export const createCollection = mutation({
  args: {
    description: v.optional(v.string()),
    title: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    // Validate input early
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
 *
 * @param ctx - Database context
 * @param args - Destroy arguments
 * @returns null
 */
export const destroyCollection = mutation({
  args: {
    id: v.id('collections'),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const collection = await ctx.db.get('collections', args.id);

    if (!collection) {
      throwNotFound('Collection not found', { resource: 'collection', resourceId: args.id });
    }

    // Check if collection is referenced by any talks
    const talksWithCollection = await getOneFrom(
      ctx.db,
      'talks',
      'by_collectionId_and_status',
      args.id,
      'collectionId',
    );

    if (talksWithCollection) {
      throwValidationError('Cannot delete collection: collection has associated talks');
    }

    // Hard delete the collection
    await ctx.db.delete(args.id);

    return null;
  },
  returns: v.null(),
});

/**
 * Update an existing collection.
 *
 * @param ctx - Database context
 * @param args - Update arguments
 * @returns The ID of the updated collection
 */
export const updateCollection = mutation({
  args: {
    description: v.optional(v.string()),
    id: v.id('collections'),
    title: v.optional(v.string()),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const { id, ...rest } = args;
    const updates: Partial<Doc<'collections'>> = rest;
    const collection: Doc<'collections'> | null = await ctx.db.get('collections', id);

    if (!collection) {
      throwNotFound('Collection not found', { resource: 'collection', resourceId: id });
    }

    if (updates.title !== undefined) {
      // Validate input early
      if (!updates.title.trim()) {
        throwValidationError('Title cannot be empty', 'title');
      }

      const newSlug = await generateSlug(ctx, 'collections', updates.title, id);

      if (newSlug !== collection.slug) {
        updates.slug = newSlug;
      }
    }

    updates.updatedAt = Date.now();

    await ctx.db.patch(id, updates);

    return id;
  },
  returns: v.id('collections'),
});
