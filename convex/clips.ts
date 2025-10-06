import { v } from 'convex/values';

import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { authComponent } from './auth';
import { clipFields, speakerFields, statusType, talkFields, topicFields } from './schema';
import { normalizeSlug } from './utils';
import { getPublished as getPublishedClips, getBySlugWithRelations } from './model/clips';

// Public query - returns only published clips (no auth required)
export const getPublished = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object(clipFields)),
  handler: async (ctx, args) => {
    const limit = args.limit || 50; // Default limit to prevent unbounded results
    return await getPublishedClips(ctx.db, limit);
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
    return await getPublishedClips(ctx.db, limit);
  },
});

// Public query - returns published clip with related data (no auth required)
export const getBySlug = query({
  args: {
    limit: v.optional(v.number()),
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
    const limit = args.limit || 20; // Default limit to prevent unbounded results
    return await getBySlugWithRelations(ctx.db, args.slug, limit);
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
