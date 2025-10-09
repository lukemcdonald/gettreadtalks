import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { clipFields } from './model/clips/schema';
import { talkFields } from './model/talks/schema';
import { mutations, queries, topicFields, validators } from './model/topics';

// ============================================
// QUERIES
// ============================================

export const get = query({
  args: validators.getTopicArgs,
  handler: async (ctx, args) => {
    return await queries.getTopic(ctx, args);
  },
  returns: v.union(v.object(topicFields), v.null()),
});

export const getBySlug = query({
  args: validators.getTopicBySlugArgs,
  handler: async (ctx, args) => {
    return await queries.getTopicBySlug(ctx, args);
  },
  returns: v.union(v.object(topicFields), v.null()),
});

export const getWithContent = query({
  args: validators.getTopicWithContentArgs,
  handler: async (ctx, args) => {
    return await queries.getTopicWithContent(ctx, args);
  },
  returns: v.union(
    v.object({
      clips: v.array(v.object(clipFields)),
      talks: v.array(v.object(talkFields)),
      topic: v.object(topicFields),
    }),
    v.null(),
  ),
});

export const list = query({
  args: validators.listTopicsArgs,
  handler: async (ctx, args) => {
    return await queries.getTopics(ctx, args);
  },
  returns: v.array(v.object(topicFields)),
});

// ============================================
// MUTATIONS
// ============================================

export const create = mutation({
  args: validators.createTopicArgs,
  handler: async (ctx, args) => {
    return await mutations.createTopic(ctx, args);
  },
  returns: v.id('topics'),
});

export const update = mutation({
  args: validators.updateTopicArgs,
  handler: async (ctx, args) => {
    return await mutations.updateTopic(ctx, args);
  },
  returns: v.id('topics'),
});
