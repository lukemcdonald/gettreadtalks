import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { doc, docs } from './lib/validators/schema';
import { mutations, queries } from './model/topics';

// ============================================
// QUERIES
// ============================================

export const get = query({
  args: {
    id: v.id('topics'),
  },
  handler: async (ctx, args) => {
    return await queries.getTopic(ctx, args);
  },
  returns: doc('topics', true),
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await queries.getTopicBySlug(ctx, args);
  },
  returns: doc('topics', true),
});

export const getWithContent = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await queries.getTopicWithContent(ctx, args);
  },
  returns: v.union(
    v.object({
      clips: docs('clips'),
      talks: docs('talks'),
      topic: doc('topics'),
    }),
    v.null(),
  ),
});

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await queries.getTopics(ctx, args);
  },
  returns: docs('topics'),
});

export const listWithCount = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await queries.getTopicsWithCount(ctx, args);
  },
  returns: v.array(
    v.object({
      count: v.number(),
      topic: doc('topics'),
    }),
  ),
});

// ============================================
// MUTATIONS
// ============================================

export const addClipToTopic = mutation({
  args: {
    clipId: v.id('clips'),
    topicId: v.id('topics'),
  },
  handler: async (ctx, args) => {
    return await mutations.addClipToTopic(ctx, args);
  },
  returns: v.id('clipsOnTopics'),
});

export const addTalkToTopic = mutation({
  args: {
    talkId: v.id('talks'),
    topicId: v.id('topics'),
  },
  handler: async (ctx, args) => {
    return await mutations.addTalkToTopic(ctx, args);
  },
  returns: v.id('talksOnTopics'),
});

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    return await mutations.createTopic(ctx, args);
  },
  returns: v.id('topics'),
});

export const destroy = mutation({
  args: {
    id: v.id('topics'),
  },
  handler: async (ctx, args) => {
    return await mutations.destroyTopic(ctx, args);
  },
  returns: v.null(),
});

export const removeClipFromTopic = mutation({
  args: {
    clipId: v.id('clips'),
    topicId: v.id('topics'),
  },
  handler: async (ctx, args) => {
    return await mutations.removeClipFromTopic(ctx, args);
  },
  returns: v.null(),
});

export const removeTalkFromTopic = mutation({
  args: {
    talkId: v.id('talks'),
    topicId: v.id('topics'),
  },
  handler: async (ctx, args) => {
    return await mutations.removeTalkFromTopic(ctx, args);
  },
  returns: v.null(),
});

export const update = mutation({
  args: {
    id: v.id('topics'),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await mutations.updateTopic(ctx, args);
  },
  returns: v.id('topics'),
});
