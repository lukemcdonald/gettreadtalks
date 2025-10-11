import { mutation, query } from './_generated/server';
import { mutations, queries, validators } from './model/topics';

// ============================================
// QUERIES
// ============================================

export const get = query({
  args: validators.getTopicArgs,
  handler: async (ctx, args) => {
    return await queries.getTopic(ctx, args);
  },
  returns: validators.getTopicReturns,
});

export const getBySlug = query({
  args: validators.getTopicBySlugArgs,
  handler: async (ctx, args) => {
    return await queries.getTopicBySlug(ctx, args);
  },
  returns: validators.getTopicBySlugReturns,
});

export const getWithContent = query({
  args: validators.getTopicWithContentArgs,
  handler: async (ctx, args) => {
    return await queries.getTopicWithContent(ctx, args);
  },
  returns: validators.getTopicWithContentReturns,
});

export const list = query({
  args: validators.listTopicsArgs,
  handler: async (ctx, args) => {
    return await queries.getTopics(ctx, args);
  },
  returns: validators.listTopicsReturns,
});

export const listWithCount = query({
  args: validators.listWithCountArgs,
  handler: async (ctx, args) => {
    return await queries.getTopicsWithCount(ctx, args);
  },
  returns: validators.listWithCountReturns,
});

// ============================================
// MUTATIONS
// ============================================

export const addClipToTopic = mutation({
  args: validators.addClipToTopicArgs,
  handler: async (ctx, args) => {
    return await mutations.addClipToTopic(ctx, args);
  },
  returns: validators.addClipToTopicReturns,
});

export const addTalkToTopic = mutation({
  args: validators.addTalkToTopicArgs,
  handler: async (ctx, args) => {
    return await mutations.addTalkToTopic(ctx, args);
  },
  returns: validators.addTalkToTopicReturns,
});

export const create = mutation({
  args: validators.createTopicArgs,
  handler: async (ctx, args) => {
    return await mutations.createTopic(ctx, args);
  },
  returns: validators.createTopicReturns,
});

export const destroy = mutation({
  args: validators.destroyTopicArgs,
  handler: async (ctx, args) => {
    return await mutations.destroyTopic(ctx, args);
  },
  returns: validators.destroyTopicReturns,
});

export const removeClipFromTopic = mutation({
  args: validators.removeClipFromTopicArgs,
  handler: async (ctx, args) => {
    return await mutations.removeClipFromTopic(ctx, args);
  },
  returns: validators.removeClipFromTopicReturns,
});

export const removeTalkFromTopic = mutation({
  args: validators.removeTalkFromTopicArgs,
  handler: async (ctx, args) => {
    return await mutations.removeTalkFromTopic(ctx, args);
  },
  returns: validators.removeTalkFromTopicReturns,
});

export const update = mutation({
  args: validators.updateTopicArgs,
  handler: async (ctx, args) => {
    return await mutations.updateTopic(ctx, args);
  },
  returns: validators.updateTopicReturns,
});
