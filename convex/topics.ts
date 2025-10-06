import { v } from 'convex/values';

import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { requireAuth } from './model';
import { clipFields, talkFields, topicFields } from './schema';
import { normalizeSlug } from './utils';
import { getBySlug as getTopicBySlug, getWithContent as getTopicWithContent } from './model/topics';

// Public query - returns all topics
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object(topicFields)),
  handler: async (ctx, args) => {
    const limit = args.limit || 100; // Default limit to prevent unbounded results
    return await ctx.db.query('topics').withIndex('by_title').take(limit);
  },
});

// Public query - returns topic by slug
export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(v.object(topicFields), v.null()),
  handler: async (ctx, args) => {
    return await getTopicBySlug(ctx.db, args.slug);
  },
});

// Public query - returns topic with related talks and clips
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
    const limit = args.limit || 50; // Default limit to prevent unbounded results
    return await getTopicWithContent(ctx.db, args.slug, limit);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
  },
  returns: v.id('topics'),
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const slug = normalizeSlug(args.title);

    const existing = await ctx.db
      .query('topics')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .first();

    if (existing) {
      throw new Error('Topic with this title already exists');
    }

    return await ctx.db.insert('topics', {
      ...args,
      slug,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('topics'),
    title: v.optional(v.string()),
  },
  returns: v.id('topics'),
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const { id, ...rest } = args;
    const updates: Partial<Doc<'topics'>> = rest;
    const topic = await ctx.db.get(id);

    if (!topic) {
      throw new Error('Topic not found');
    }

    if (updates.title) {
      const newSlug = normalizeSlug(updates.title);

      if (newSlug !== topic.slug) {
        const existing = await ctx.db
          .query('topics')
          .withIndex('by_slug', (q) => q.eq('slug', newSlug))
          .first();

        if (existing && existing._id !== id) {
          throw new Error('Topic with this title already exists');
        }

        updates.slug = newSlug;
      }
    }

    updates.updatedAt = Date.now();

    await ctx.db.patch(id, updates);

    return id;
  },
});
