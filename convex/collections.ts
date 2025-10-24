import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { doc, docs } from './lib/validators/schema';
import { mutations, queries } from './model/collections';

// ============================================
// QUERIES
// ============================================

export const get = query({
  args: {
    id: v.id('collections'),
  },
  handler: async (ctx, args) => {
    return await queries.getCollection(ctx, args);
  },
  returns: doc('collections', true),
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await queries.getCollectionBySlug(ctx, args);
  },
  returns: doc('collections', true),
});

export const getWithSpeakers = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await queries.getCollectionWithSpeakers(ctx, args);
  },
  returns: v.union(
    v.object({
      collection: doc('collections'),
      speakers: docs('speakers'),
    }),
    v.null(),
  ),
});

export const getWithTalks = query({
  args: {
    id: v.id('collections'),
  },
  handler: async (ctx, args) => {
    return await queries.getCollectionWithTalks(ctx, args);
  },
  returns: v.union(
    v.object({
      collection: doc('collections'),
      talks: docs('talks'),
    }),
    v.null(),
  ),
});

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await queries.getCollections(ctx, args);
  },
  returns: v.any(), // PaginationResult<Doc<'collections'>>
});

export const listBySpeaker = query({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    return await queries.getCollectionsBySpeaker(ctx, args);
  },
  returns: docs('collections'),
});

export const listWithStats = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await queries.getCollectionsWithStats(ctx, args);
  },
  returns: v.any(), // PaginationResult with stats
});

// ============================================
// MUTATIONS
// ============================================

export const create = mutation({
  args: {
    description: v.optional(v.string()),
    title: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await mutations.createCollection(ctx, args);
  },
  returns: v.id('collections'),
});

export const destroy = mutation({
  args: {
    id: v.id('collections'),
  },
  handler: async (ctx, args) => {
    return await mutations.destroyCollection(ctx, args);
  },
  returns: v.null(),
});

export const update = mutation({
  args: {
    description: v.optional(v.string()),
    id: v.id('collections'),
    title: v.optional(v.string()),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await mutations.updateCollection(ctx, args);
  },
  returns: v.id('collections'),
});
