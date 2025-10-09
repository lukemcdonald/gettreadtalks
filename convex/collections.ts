import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { collectionFields, mutations, queries, validators } from './model/collections';
import { talkFields } from './model/talks/schema';

// ============================================
// QUERIES
// ============================================

export const get = query({
  args: validators.getCollectionArgs,
  handler: async (ctx, args) => {
    return await queries.getCollection(ctx, args);
  },
  returns: v.union(v.object(collectionFields), v.null()),
});

export const getBySlug = query({
  args: validators.getCollectionBySlugArgs,
  handler: async (ctx, args) => {
    return await queries.getCollectionBySlug(ctx, args);
  },
  returns: v.union(v.object(collectionFields), v.null()),
});

export const getWithTalks = query({
  args: validators.getCollectionWithTalksArgs,
  handler: async (ctx, args) => {
    return await queries.getCollectionWithTalks(ctx, args);
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
  args: validators.listCollectionsArgs,
  handler: async (ctx, args) => {
    return await queries.getCollections(ctx, args);
  },
  returns: v.array(v.object(collectionFields)),
});

// ============================================
// MUTATIONS
// ============================================

export const create = mutation({
  args: validators.createCollectionArgs,
  handler: async (ctx, args) => {
    return await mutations.createCollection(ctx, args);
  },
  returns: v.id('collections'),
});

export const update = mutation({
  args: validators.updateCollectionArgs,
  handler: async (ctx, args) => {
    return await mutations.updateCollection(ctx, args);
  },
  returns: v.id('collections'),
});
