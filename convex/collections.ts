import { mutation, query } from './_generated/server';
import { mutations, queries, validators } from './model/collections';

// ============================================
// QUERIES
// ============================================

export const get = query({
  args: validators.getCollectionArgs,
  handler: async (ctx, args) => {
    return await queries.getCollection(ctx, args);
  },
  returns: validators.getCollectionReturns,
});

export const getBySlug = query({
  args: validators.getCollectionBySlugArgs,
  handler: async (ctx, args) => {
    return await queries.getCollectionBySlug(ctx, args);
  },
  returns: validators.getCollectionBySlugReturns,
});

export const getWithSpeakers = query({
  args: validators.getCollectionWithSpeakersArgs,
  handler: async (ctx, args) => {
    return await queries.getCollectionWithSpeakers(ctx, args);
  },
  returns: validators.getCollectionWithSpeakersReturns,
});

export const getWithTalks = query({
  args: validators.getCollectionWithTalksArgs,
  handler: async (ctx, args) => {
    return await queries.getCollectionWithTalks(ctx, args);
  },
  returns: validators.getCollectionWithTalksReturns,
});

export const list = query({
  args: validators.listCollectionsArgs,
  handler: async (ctx, args) => {
    return await queries.getCollections(ctx, args);
  },
  returns: validators.listCollectionsReturns,
});

export const listBySpeaker = query({
  args: validators.listBySpeakerArgs,
  handler: async (ctx, args) => {
    return await queries.getCollectionsBySpeaker(ctx, args);
  },
  returns: validators.listBySpeakerReturns,
});

export const listWithStats = query({
  args: validators.listWithStatsArgs,
  handler: async (ctx, args) => {
    return await queries.getCollectionsWithStats(ctx, args);
  },
  returns: validators.listWithStatsReturns,
});

// ============================================
// MUTATIONS
// ============================================

export const create = mutation({
  args: validators.createCollectionArgs,
  handler: async (ctx, args) => {
    return await mutations.createCollection(ctx, args);
  },
  returns: validators.createCollectionReturns,
});

export const destroy = mutation({
  args: validators.destroyCollectionArgs,
  handler: async (ctx, args) => {
    return await mutations.destroyCollection(ctx, args);
  },
  returns: validators.destroyCollectionReturns,
});

export const update = mutation({
  args: validators.updateCollectionArgs,
  handler: async (ctx, args) => {
    return await mutations.updateCollection(ctx, args);
  },
  returns: validators.updateCollectionReturns,
});
