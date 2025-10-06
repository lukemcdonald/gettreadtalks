import { v } from 'convex/values';

import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { collectionFields, talkFields } from './schema';
import { requireAuth } from './model/auth/queries';
import { normalizeSlug } from './utils';
import {
  getBySlug as getCollectionBySlug,
  getWithTalks as getCollectionWithTalks,
} from './model/collections';

// Public query - returns all collections
export const getAll = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object(collectionFields)),
  handler: async (ctx, args) => {
    const limit = args.limit || 100; // Default limit to prevent unbounded results
    return await ctx.db.query('collections').take(limit);
  },
});

// Public query - returns collection by slug
export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(v.object(collectionFields), v.null()),
  handler: async (ctx, args) => {
    return await getCollectionBySlug(ctx, args.slug);
  },
});

// Public query - returns collection with its talks
export const getWithTalks = query({
  args: {
    limit: v.optional(v.number()),
    slug: v.string(),
  },
  returns: v.union(
    v.object({
      collection: v.object(collectionFields),
      talks: v.array(v.object(talkFields)),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const limit = args.limit || 100; // Default limit to prevent unbounded results
    return await getCollectionWithTalks(ctx, args.slug, limit);
  },
});

export const create = mutation({
  args: {
    description: v.optional(v.string()),
    title: v.string(),
    url: v.optional(v.string()),
  },
  returns: v.id('collections'),
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const slug = normalizeSlug(args.title);

    const existing = await ctx.db
      .query('collections')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .first();

    if (existing) {
      throw new Error('Collection with this title already exists');
    }

    return await ctx.db.insert('collections', {
      ...args,
      slug,
    });
  },
});

export const update = mutation({
  args: {
    description: v.optional(v.string()),
    id: v.id('collections'),
    title: v.optional(v.string()),
    url: v.optional(v.string()),
  },
  returns: v.id('collections'),
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const { id, ...rest } = args;
    const updates: Partial<Doc<'collections'>> = rest;
    const collection = await ctx.db.get(id);

    if (!collection) {
      throw new Error('Collection not found');
    }

    if (updates.title) {
      const newSlug = normalizeSlug(updates.title);

      if (newSlug !== collection.slug) {
        const existing = await ctx.db
          .query('collections')
          .withIndex('by_slug', (q) => q.eq('slug', newSlug))
          .first();

        if (existing && existing._id !== id) {
          throw new Error('Collection with this title already exists');
        }

        updates.slug = newSlug;
      }
    }

    updates.updatedAt = Date.now();

    await ctx.db.patch(id, updates);

    return id;
  },
});
