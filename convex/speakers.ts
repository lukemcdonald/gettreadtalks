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

export const getCount = query({
  args: validators.getCountArgs,
  handler: async (ctx) => {
    return await queries.getSpeakersCount(ctx);
  },
  returns: validators.getCountReturns,
});

export const getFeatured = query({
  args: validators.getFeaturedSpeakersArgs,
  handler: async (ctx, args) => {
    return await queries.getFeaturedSpeakers(ctx, args);
  },
  returns: validators.getFeaturedSpeakersReturns,
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

export const destroy = mutation({
  args: validators.destroySpeakerArgs,
  handler: async (ctx, args) => {
    return await mutations.destroySpeaker(ctx, args);
  },
  returns: validators.destroySpeakerReturns,
});

export const update = mutation({
  args: validators.updateSpeakerArgs,
  handler: async (ctx, args) => {
    return await mutations.updateSpeaker(ctx, args);
  },
  returns: validators.updateSpeakerReturns,
});
