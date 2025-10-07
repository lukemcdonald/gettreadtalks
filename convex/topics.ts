import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { clipFields } from './model/clips/schema';
import { talkFields } from './model/talks/schema';
import { createTopic, updateTopic } from './model/topics/mutations.js';
import {
  getBySlug as getTopicBySlug,
  getWithContent as getTopicWithContent,
} from './model/topics/queries';
import { topicFields } from './model/topics/schema';

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 100 } = args;
    return await ctx.db.query('topics').withIndex('by_title').take(limit);
  },
  returns: v.array(v.object(topicFields)),
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await getTopicBySlug(ctx, args.slug);
  },
  returns: v.union(v.object(topicFields), v.null()),
});

export const getWithContent = query({
  args: {
    limit: v.optional(v.number()),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const { limit = 50, slug } = args;
    return await getTopicWithContent(ctx, slug, limit);
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

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    return await createTopic(ctx, args);
  },
  returns: v.id('topics'),
});

export const update = mutation({
  args: {
    id: v.id('topics'),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await updateTopic(ctx, args);
  },
  returns: v.id('topics'),
});
