import { v } from 'convex/values';

import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { requireAuth } from './lib/permissions';
import { clipFields, talkFields, topicFields } from './schema';
import { normalizeSlug } from './utils';

// Public query - returns all topics
export const list = query({
  args: {},
  returns: v.array(v.object(topicFields)),
  handler: async (ctx) => {
    return await ctx.db.query('topics').withIndex('by_title').collect();
  },
});

// Public query - returns topic by slug
export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(v.object(topicFields), v.null()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('topics')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique();
  },
});

// Public query - returns topic with related talks and clips
export const getWithContent = query({
  args: {
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
    const topic = await ctx.db
      .query('topics')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique();

    if (!topic) {
      return null;
    }

    const talkTopics = await ctx.db
      .query('talksOnTopics')
      .withIndex('by_topic_id', (q) => q.eq('topicId', topic._id))
      .collect();

    const talks = [];
    for (const talkTopic of talkTopics) {
      const talk = await ctx.db.get(talkTopic.talkId);
      if (talk && talk.status === 'published') {
        talks.push(talk);
      }
    }

    const clipTopics = await ctx.db
      .query('clipsOnTopics')
      .withIndex('by_topic_id', (q) => q.eq('topicId', topic._id))
      .collect();

    const clips = [];
    for (const clipTopic of clipTopics) {
      const clip = await ctx.db.get(clipTopic.clipId);
      if (clip && clip.status === 'published') {
        clips.push(clip);
      }
    }

    return {
      clips,
      talks,
      topic,
    };
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
      createdAt: Date.now(),
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
