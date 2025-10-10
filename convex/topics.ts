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

// ============================================
// MUTATIONS
// ============================================

export const create = mutation({
  args: validators.createTopicArgs,
  handler: async (ctx, args) => {
    return await mutations.createTopic(ctx, args);
  },
  returns: validators.createTopicReturns,
});

export const deleteTopic = mutation({
  args: validators.deleteTopicArgs,
  handler: async (ctx, args) => {
    return await mutations.deleteTopic(ctx, args);
  },
  returns: validators.deleteTopicReturns,
});

export const update = mutation({
  args: validators.updateTopicArgs,
  handler: async (ctx, args) => {
    return await mutations.updateTopic(ctx, args);
  },
  returns: validators.updateTopicReturns,
});
