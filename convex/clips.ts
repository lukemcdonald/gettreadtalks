import { v } from 'convex/values';

import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { authComponent } from './auth';
import { normalizeSlug } from './utils';

export const getPublished = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    return await ctx.db
      .query('clips')
      .withIndex('by_status_and_published_at', (q) => q.eq('status', 'published'))
      .order('desc')
      .collect();
  },
});

export const getLatest = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    return await ctx.db
      .query('clips')
      .withIndex('by_status_and_published_at', (q) => q.eq('status', 'published'))
      .order('desc')
      .take(limit);
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(
    v.object({
      clip: v.any(),
      speaker: v.union(v.any(), v.null()),
      talk: v.union(v.any(), v.null()),
      topics: v.array(v.any()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const clip = await ctx.db
      .query('clips')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique();

    if (!clip || clip.status !== 'published') {
      return null;
    }

    // Get speaker if exists
    let speaker = null;
    if (clip.speakerId) {
      speaker = await ctx.db.get(clip.speakerId);
    }

    // Get talk if exists
    let talk = null;
    if (clip.talkId) {
      talk = await ctx.db.get(clip.talkId);
    }

    // Get topics
    const clipTopics = await ctx.db
      .query('clipsOnTopics')
      .withIndex('by_clip_id', (q) => q.eq('clipId', clip._id))
      .collect();

    const topics = [];
    for (const clipTopic of clipTopics) {
      const topic = await ctx.db.get(clipTopic.topicId);
      if (topic) topics.push(topic);
    }

    return { clip, speaker, talk, topics };
  },
});

export const create = mutation({
  args: {
    mediaUrl: v.string(),
    speakerId: v.optional(v.id('speakers')),
    status: v.optional(
      v.union(
        v.literal('backlog'),
        v.literal('approved'),
        v.literal('published'),
        v.literal('archived'),
      ),
    ),
    talkId: v.optional(v.id('talks')),
    title: v.string(),
  },
  returns: v.id('clips'),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error('Authentication required');
    }

    const slug = normalizeSlug(args.title);

    const existing = await ctx.db
      .query('clips')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .first();

    if (existing) {
      throw new Error('Clip with this title already exists');
    }

    const status = args.status || 'backlog';
    const publishedAt = status === 'published' ? Date.now() : undefined;

    return await ctx.db.insert('clips', {
      ...args,
      createdAt: Date.now(),
      publishedAt,
      slug,
      status,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id('clips'),
    status: v.union(
      v.literal('backlog'),
      v.literal('approved'),
      v.literal('published'),
      v.literal('archived'),
    ),
  },
  returns: v.id('clips'),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new Error('Authentication required');
    }

    const clip = await ctx.db.get(args.id);

    if (!clip) {
      throw new Error('Clip not found');
    }

    const updates: Partial<Doc<'clips'>> = {
      status: args.status,
    };

    if (args.status === 'published' && !clip.publishedAt) {
      updates.publishedAt = Date.now();
    } else if (args.status !== 'published') {
      updates.publishedAt = undefined;
    }

    updates.updatedAt = Date.now();
    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});
