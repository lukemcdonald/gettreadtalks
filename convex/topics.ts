import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { topicFields } from './model/topics/schema';
import {
  getBySlug as getTopicBySlug,
  getWithContent as getTopicWithContent,
} from './model/topics/queries';
import { clipFields } from './model/clips/schema';
import { talkFields } from './model/talks/schema';
import { createTopic, updateTopic } from './model/topics/mutations.js';

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object(topicFields)),
  handler: async (ctx, args) => {
    const { limit = 100 } = args;
    return await ctx.db.query('topics').withIndex('by_title').take(limit);
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(v.object(topicFields), v.null()),
  handler: async (ctx, args) => {
    return await getTopicBySlug(ctx, args.slug);
  },
});

export const getWithContent = query({
  args: {
    limit: v.optional(v.number()),
    slug: v.string(),
  },
  returns: v.union(
    v.object({
      clips: v.array(v.object(clipFields)),
      talks: v.array(v.object(talkFields)),
      topic: v.object(topicFields),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const { limit = 50, slug } = args;
    return await getTopicWithContent(ctx, slug, limit);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
  },
  returns: v.id('topics'),
  handler: async (ctx, args) => {
    return await createTopic(ctx, args);
  },
});

export const update = mutation({
  args: {
    id: v.id('topics'),
    title: v.optional(v.string()),
  },
  returns: v.id('topics'),
  handler: async (ctx, args) => {
    return await updateTopic(ctx, args);
  },
});
