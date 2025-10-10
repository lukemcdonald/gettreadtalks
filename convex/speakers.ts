import { mutation, query } from './_generated/server';
import { mutations, queries, validators } from './model/speakers';

// ============================================
// QUERIES
// ============================================

export const get = query({
  args: validators.getSpeakerArgs,
  handler: async (ctx, args) => {
    return await queries.getSpeaker(ctx, args);
  },
  returns: validators.getSpeakerReturns,
});

export const getBySlug = query({
  args: validators.getSpeakerBySlugArgs,
  handler: async (ctx, args) => {
    return await queries.getSpeakerBySlug(ctx, args);
  },
  returns: validators.getSpeakerBySlugReturns,
});

export const getFeatured = query({
  args: validators.getFeaturedSpeakersArgs,
  handler: async (ctx, args) => {
    return await queries.getFeaturedSpeakers(ctx, args);
  },
  returns: validators.getFeaturedSpeakersReturns,
});

export const getSpeakersCount = query({
  args: validators.getSpeakersCountArgs,
  handler: async (ctx, args) => {
    return await queries.getSpeakersCount(ctx);
  },
  returns: validators.getSpeakersCountReturns,
});

export const list = query({
  args: validators.listSpeakersArgs,
  handler: async (ctx, args) => {
    return await queries.getSpeakers(ctx, args);
  },
  returns: validators.listSpeakersReturns,
});

// ============================================
// MUTATIONS
// ============================================

export const create = mutation({
  args: validators.createSpeakerArgs,
  handler: async (ctx, args) => {
    return await mutations.createSpeaker(ctx, args);
  },
  returns: validators.createSpeakerReturns,
});

export const remove = mutation({
  args: validators.removeSpeakerArgs,
  handler: async (ctx, args) => {
    return await mutations.removeSpeaker(ctx, args);
  },
  returns: validators.removeSpeakerReturns,
});

export const update = mutation({
  args: validators.updateSpeakerArgs,
  handler: async (ctx, args) => {
    return await mutations.updateSpeaker(ctx, args);
  },
  returns: validators.updateSpeakerReturns,
});
