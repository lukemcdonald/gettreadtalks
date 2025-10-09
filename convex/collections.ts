import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { createCollection, updateCollection } from './model/collections/mutations';
import {
  getCollection,
  getCollectionBySlug,
  getCollections,
  getCollectionWithTalks,
} from './model/collections/queries';
import { collectionFields } from './model/collections/schema';
import { talkFields } from './model/talks/schema';
import { createCollectionArgs, updateCollectionArgs } from './model/collections/validators';

// ============================================
// QUERIES
// ============================================

export const get = query({
  args: {
    id: v.id('collections'),
  },
  handler: async (ctx, args) => {
    return await getCollection(ctx, args.id);
  },
  returns: v.union(v.object(collectionFields), v.null()),
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await getCollectionBySlug(ctx, args.slug);
  },
  returns: v.union(v.object(collectionFields), v.null()),
});

export const getWithTalks = query({
  args: {
    limit: v.optional(v.number()),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const { limit = 100, slug } = args;
    return await getCollectionWithTalks(ctx, slug, limit);
  },
  returns: v.union(
    v.object({
      collection: v.object(collectionFields),
      talks: v.array(v.object(talkFields)),
    }),
    v.null(),
  ),
});

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 100 } = args;
    return await getCollections(ctx, limit);
  },
  returns: v.array(v.object(collectionFields)),
});

// ============================================
// MUTATIONS
// ============================================

export const create = mutation({
  args: createCollectionArgs,
  handler: async (ctx, args) => {
    return await createCollection(ctx, args);
  },
  returns: v.id('collections'),
});

export const update = mutation({
  args: updateCollectionArgs,
  handler: async (ctx, args) => {
    return await updateCollection(ctx, args);
  },
  returns: v.id('collections'),
});
