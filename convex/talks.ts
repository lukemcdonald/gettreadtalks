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

export const getBySlug = query({
  args: validators.getTalkBySlugArgs,
  handler: async (ctx, args) => {
    return await queries.getTalkBySlugWithRelations(ctx, args);
  },
  returns: validators.getTalkBySlugReturns,
});

export const getFeatured = query({
  args: validators.getFeaturedTalksArgs,
  handler: async (ctx, args) => {
    return await queries.getFeaturedTalks(ctx, args);
  },
  returns: validators.getFeaturedTalksReturns,
});

export const getRandomBySpeaker = query({
  args: validators.getRandomTalksBySpeakerArgs,
  handler: async (ctx, args) => {
    return await queries.getRandomTalksBySpeaker(ctx, args);
  },
  returns: validators.getRandomTalksBySpeakerReturns,
});

export const getTalksCount = query({
  args: validators.getTalksCountArgs,
  handler: async (ctx, args) => {
    return await queries.getTalksCount(ctx);
  },
  returns: validators.getTalksCountReturns,
});

export const getTalksCountByCollection = query({
  args: validators.getTalksCountByCollectionArgs,
  handler: async (ctx, args) => {
    return await queries.getTalksCountByCollection(ctx, args);
  },
  returns: validators.getTalksCountByCollectionReturns,
});

export const getTalksCountByTopic = query({
  args: validators.getTalksCountByTopicArgs,
  handler: async (ctx, args) => {
    return await queries.getTalksCountByTopic(ctx, args);
  },
  returns: validators.getTalksCountByTopicReturns,
});

export const list = query({
  args: validators.listTalksArgs,
  handler: async (ctx, args) => {
    return await queries.getTalks(ctx, args);
  },
  returns: validators.listTalksReturns,
});

export const listByCollection = query({
  args: validators.listTalksByCollectionArgs,
  handler: async (ctx, args) => {
    return await queries.getTalksByCollection(ctx, args);
  },
  returns: validators.listTalksByCollectionReturns,
});

export const listBySpeaker = query({
  args: validators.listTalksBySpeakerArgs,
  handler: async (ctx, args) => {
    return await queries.getTalksBySpeaker(ctx, args);
  },
  returns: validators.listTalksBySpeakerReturns,
});

export const listWithSpeakers = query({
  args: validators.listTalksWithSpeakersArgs,
  handler: async (ctx, args) => {
    return await queries.getTalksWithSpeakers(ctx, args);
  },
  returns: validators.listTalksWithSpeakersReturns,
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

export const remove = mutation({
  args: validators.removeTalkArgs,
  handler: async (ctx, args) => {
    return await mutations.removeTalk(ctx, args);
  },
  returns: validators.removeTalkReturns,
});

export const update = mutation({
  args: validators.updateTalkArgs,
  handler: async (ctx, args) => {
    return await mutations.updateTalk(ctx, args);
  },
  returns: validators.updateTalkReturns,
});

export const updateStatus = mutation({
  args: validators.updateTalkStatusArgs,
  handler: async (ctx, args) => {
    return await mutations.updateTalkStatus(ctx, args);
  },
  returns: validators.updateTalkStatusReturns,
});
