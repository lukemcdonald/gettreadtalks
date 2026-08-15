import type { Doc } from '../../_generated/dataModel';

import { getOneFrom } from 'convex-helpers/server/relationships';
import { v } from 'convex/values';

import { mutation } from '../../_generated/server';
import {
  throwDuplicateSlug,
  throwNotFound,
  throwValidationError,
} from '../../lib/errors';
import { generateSlug, slugExists, slugify } from '../../lib/utils';
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
      'collectionId'
    );

    if (talksWithCollection) {
      throwValidationError(
        'Cannot delete collection: collection has associated talks'
      );
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
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { collectionId, slug: rawSlug, ...rest } = args;

    await requireAuth(ctx);

    const updates: Partial<Doc<'collections'>> = rest;
    const collection: Doc<'collections'> | null = await ctx.db.get(
      'collections',
      collectionId
    );

    if (!collection) {
      throwNotFound('Collection not found', {
        resource: 'collection',
        resourceId: collectionId,
      });
    }

    if (rawSlug !== undefined) {
      // Use explicit slug if provided
      const newSlug = slugify(rawSlug);

      if (!newSlug) {
        throwValidationError('Slug cannot be empty', 'slug');
      }

      if (newSlug !== collection.slug) {
        if (await slugExists(ctx, 'collections', newSlug, collectionId)) {
          throwDuplicateSlug(
            'A collection with this slug already exists',
            'slug'
          );
        }

        updates.slug = newSlug;
      }
    } else if (updates.title !== undefined) {
      // Auto-generate slug from title when no explicit slug provided
      if (!updates.title.trim()) {
        throwValidationError('Title cannot be empty', 'title');
      }

      const newSlug = await generateSlug(
        ctx,
        'collections',
        updates.title,
        collectionId
      );

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
