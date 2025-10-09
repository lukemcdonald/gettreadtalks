import { mutation, query } from './_generated/server';
import { mutations, queries, validators } from './model/talks';

// ============================================
// QUERIES
// ============================================

export const get = query({
  args: validators.getTalkArgs,
  handler: async (ctx, args) => {
    return await queries.getTalk(ctx, args);
  },
  returns: validators.getTalkReturns,
});

export const getByCollection = query({
  args: validators.getTalksByCollectionArgs,
  handler: async (ctx, args) => {
    return await queries.getTalksByCollection(ctx, args);
  },
  returns: validators.getTalksByCollectionReturns,
});

export const getBySlug = query({
  args: validators.getTalkBySlugArgs,
  handler: async (ctx, args) => {
    return await queries.getTalkBySlugWithRelations(ctx, args);
  },
  returns: validators.getTalkBySlugReturns,
});

export const getBySpeaker = query({
  args: validators.getTalksBySpeakerArgs,
  handler: async (ctx, args) => {
    return await queries.getTalksBySpeaker(ctx, args);
  },
  returns: validators.getTalksBySpeakerReturns,
});

export const list = query({
  args: validators.listTalksArgs,
  handler: async (ctx, args) => {
    return await queries.getTalksWithSpeakers(ctx, args);
  },
  returns: validators.listTalksReturns,
});

// ============================================
// MUTATIONS
// ============================================

export const create = mutation({
  args: validators.createTalkArgs,
  handler: async (ctx, args) => {
    return await mutations.createTalk(ctx, args);
  },
  returns: validators.createTalkReturns,
});

export const updateStatus = mutation({
  args: validators.updateTalkStatusArgs,
  handler: async (ctx, args) => {
    return await mutations.updateTalkStatus(ctx, args);
  },
  returns: validators.updateTalkStatusReturns,
});
