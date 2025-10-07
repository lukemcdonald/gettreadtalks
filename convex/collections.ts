import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { talkFields } from './model/talks/schema';
import {
  getBySlug as getCollectionBySlug,
  getWithTalks as getCollectionWithTalks,
} from './model/collections/queries';
import { createCollection, updateCollection } from './model/collections/mutations';
import { collectionFields } from './model/collections/schema';

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object(collectionFields)),
  handler: async (ctx, args) => {
    const { limit = 100 } = args;
    return await ctx.db.query('collections').take(limit);
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(v.object(collectionFields), v.null()),
  handler: async (ctx, args) => {
    const { slug } = args;
    return await getCollectionBySlug(ctx, slug);
  },
});

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
    const { limit = 100, slug } = args;
    return await getCollectionWithTalks(ctx, slug, limit);
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
    return await createCollection(ctx, args);
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
    return await updateCollection(ctx, args);
  },
});
