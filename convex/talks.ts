import { v } from 'convex/values';

import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { authComponent } from './auth';
import { collectionFields, speakerFields, statusType, talkFields } from './schema';
import { normalizeSlug } from './utils';

// Public query - returns published talks with speaker data
export const getPublished = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      ...talkFields,
      speaker: v.union(v.object(speakerFields), v.null()),
    }),
  ),
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

// Public query - returns published talk with related data
export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(
    v.object({
      ...talkFields,
      collection: v.union(v.object(collectionFields), v.null()),
      speaker: v.union(v.object(speakerFields), v.null()),
    }),
    v.null(),
  ),
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

// Public query - returns published talks by speaker
export const getBySpeaker = query({
  args: {
    limit: v.optional(v.number()),
    speakerId: v.id('speakers'),
  },
  returns: v.array(v.object(talkFields)),
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

// Public query - returns published talks in a collection
export const getByCollection = query({
  args: {
    collectionId: v.id('collections'),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object(talkFields)),
  handler: async (ctx, args) => {
    const limit = args.limit || 100; // Default limit to prevent unbounded results
    const talks = await ctx.db
      .query('talks')
      .withIndex('by_collection_id_and_status', (q) =>
        q.eq('collectionId', args.collectionId).eq('status', 'published'),
      )
      .take(limit);

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
    status: v.optional(statusType),
    title: v.string(),
  },
  returns: v.id('talks'),
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
      publishedAt,
      slug,
      status,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id('talks'),
    status: statusType,
  },
  returns: v.id('talks'),
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
