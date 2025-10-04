import { v } from 'convex/values';

import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { authComponent } from './auth';
import { clipFields, speakerFields, statusType, talkFields, topicFields } from './schema';
import { normalizeSlug } from './utils';

// Public query - returns only published clips (no auth required)
export const getPublished = query({
  args: {},
  returns: v.array(v.object(clipFields)),
  handler: async (ctx) => {
    return await ctx.db
      .query('clips')
      .withIndex('by_status_and_published_at', (q) => q.eq('status', 'published'))
      .order('desc')
      .collect();
  },
});

// Public query - returns latest published clips (no auth required)
export const getLatest = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object(clipFields)),
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    return await ctx.db
      .query('clips')
      .withIndex('by_status_and_published_at', (q) => q.eq('status', 'published'))
      .order('desc')
      .take(limit);
  },
});

// Public query - returns published clip with related data (no auth required)
export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(
    v.object({
      clip: v.object(clipFields),
      speaker: v.union(v.object(speakerFields), v.null()),
      talk: v.union(v.object(talkFields), v.null()),
      topics: v.array(v.object(topicFields)),
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
    description: v.optional(v.string()),
    mediaUrl: v.string(),
    speakerId: v.optional(v.id('speakers')),
    status: v.optional(statusType),
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
    status: statusType,
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
