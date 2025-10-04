import { v } from 'convex/values';

import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { authComponent } from './auth';
import { normalizeSlug } from './utils';

export const getPublished = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const talks = await ctx.db
      .query('talks')
      .withIndex('by_status_and_published_at', (q) => q.eq('status', 'published'))
      .order('desc')
      .take(limit);

    // Fetch speaker information for each talk
    const talksWithSpeakers = await Promise.all(
      talks.map(async (talk) => {
        const speaker = await ctx.db.get(talk.speakerId);
        return {
          ...talk,
          speaker,
        };
      }),
    );

    return talksWithSpeakers;
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const talk = await ctx.db
      .query('talks')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique();

    if (!talk) {
      return null;
    }

    const speaker = await ctx.db.get(talk.speakerId);

    let collection = null;
    if (talk.collectionId) {
      collection = await ctx.db.get(talk.collectionId);
    }

    return {
      ...talk,
      collection,
      speaker,
    };
  },
});

export const getBySpeaker = query({
  args: {
    limit: v.optional(v.number()),
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;

    return await ctx.db
      .query('talks')
      .withIndex('by_speaker_id_and_status', (q) =>
        q.eq('speakerId', args.speakerId).eq('status', 'published'),
      )
      .order('desc')
      .take(limit);
  },
});

export const getByCollection = query({
  args: {
    collectionId: v.id('collections'),
  },
  handler: async (ctx, args) => {
    const talks = await ctx.db
      .query('talks')
      .withIndex('by_collection_id_and_status', (q) =>
        q.eq('collectionId', args.collectionId).eq('status', 'published'),
      )
      .collect();

    // Sort by collectionOrder
    return talks.sort((a, b) => (a.collectionOrder || 0) - (b.collectionOrder || 0));
  },
});

export const create = mutation({
  args: {
    collectionId: v.optional(v.id('collections')),
    collectionOrder: v.optional(v.number()),
    mediaUrl: v.string(),
    scripture: v.optional(v.string()),
    speakerId: v.id('speakers'),
    status: v.optional(
      v.union(
        v.literal('backlog'),
        v.literal('approved'),
        v.literal('published'),
        v.literal('archived'),
      ),
    ),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new Error('Authentication required');
    }

    const slug = normalizeSlug(args.title);

    const existing = await ctx.db
      .query('talks')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .first();

    if (existing) {
      throw new Error('Talk with this title already exists');
    }

    const status = args.status || 'backlog';
    const publishedAt = status === 'published' ? Date.now() : undefined;

    return await ctx.db.insert('talks', {
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
    id: v.id('talks'),
    status: v.union(
      v.literal('backlog'),
      v.literal('approved'),
      v.literal('published'),
      v.literal('archived'),
    ),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new Error('Authentication required');
    }

    const talk = await ctx.db.get(args.id);

    if (!talk) {
      throw new Error('Talk not found');
    }

    const updates: Partial<Doc<'talks'>> = {
      status: args.status,
    };

    if (args.status === 'published' && !talk.publishedAt) {
      updates.publishedAt = Date.now();
    } else if (args.status !== 'published') {
      updates.publishedAt = undefined;
    }

    updates.updatedAt = Date.now();

    await ctx.db.patch(args.id, updates);

    return args.id;
  },
});
