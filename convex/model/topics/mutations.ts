import type { Doc } from '../../_generated/dataModel';

import { v } from 'convex/values';
import { getOneFrom } from 'convex-helpers/server/relationships';

import { mutation } from '../../_generated/server';
import { throwNotFound, throwValidationError } from '../../lib/errors';
import { generateSlug } from '../../lib/utils';
import { requireAuth } from '../auth/utils';
import { topicStatus } from './validators';

/**
 * Add a clip to a topic.
 */
export const addClipToTopic = mutation({
  args: {
    clipId: v.id('clips'),
    topicId: v.id('topics'),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const clip = await ctx.db.get('clips', args.clipId);
    if (!clip) {
      throwNotFound('Clip not found', { resource: 'clip', resourceId: args.clipId });
    }

    const topic = await ctx.db.get('topics', args.topicId);
    if (!topic) {
      throwNotFound('Topic not found', { resource: 'topic', resourceId: args.topicId });
    }

    const existing = await ctx.db
      .query('clipsOnTopics')
      .withIndex('by_clipId_and_topicId', (q) =>
        q.eq('clipId', args.clipId).eq('topicId', args.topicId),
      )
      .unique();

    if (existing) {
      throwValidationError('Clip is already associated with this topic');
    }

    return await ctx.db.insert('clipsOnTopics', {
      clipId: args.clipId,
      topicId: args.topicId,
    });
  },
  returns: v.id('clipsOnTopics'),
});

/**
 * Add a talk to a topic.
 */
export const addTalkToTopic = mutation({
  args: {
    talkId: v.id('talks'),
    topicId: v.id('topics'),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const talk = await ctx.db.get('talks', args.talkId);
    if (!talk) {
      throwNotFound('Talk not found', { resource: 'talk', resourceId: args.talkId });
    }

    const topic = await ctx.db.get('topics', args.topicId);
    if (!topic) {
      throwNotFound('Topic not found', { resource: 'topic', resourceId: args.topicId });
    }

    const existing = await ctx.db
      .query('talksOnTopics')
      .withIndex('by_talkId_and_topicId', (q) =>
        q.eq('talkId', args.talkId).eq('topicId', args.topicId),
      )
      .unique();

    if (existing) {
      throwValidationError('Talk is already associated with this topic');
    }

    return await ctx.db.insert('talksOnTopics', {
      talkId: args.talkId,
      topicId: args.topicId,
    });
  },
  returns: v.id('talksOnTopics'),
});

/**
 * Create a new topic.
 */
export const createTopic = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    // Validate input early
    if (!args.title.trim()) {
      throwValidationError('Title cannot be empty', 'title');
    }

    const slug = await generateSlug(ctx, 'topics', args.title);

    return await ctx.db.insert('topics', {
      ...args,
      slug,
    });
  },
  returns: v.id('topics'),
});

/**
 * Destroy a topic (permanently delete from database with reference checks).
 */
export const destroyTopic = mutation({
  args: {
    id: v.id('topics'),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const topic = await ctx.db.get('topics', args.id);

    if (!topic) {
      throwNotFound('Topic not found', { resource: 'topic', resourceId: args.id });
    }

    // Check if topic is referenced by any talks
    const talksWithTopic = await getOneFrom(ctx.db, 'talksOnTopics', 'by_topicId', args.id);

    if (talksWithTopic) {
      throwValidationError('Cannot delete topic: topic has associated talks');
    }

    // Check if topic is referenced by any clips
    const clipsWithTopic = await getOneFrom(ctx.db, 'clipsOnTopics', 'by_topicId', args.id);

    if (clipsWithTopic) {
      throwValidationError('Cannot delete topic: topic has associated clips');
    }

    // Hard delete the topic
    await ctx.db.delete(args.id);

    return null;
  },
  returns: v.null(),
});

/**
 * Remove a clip from a topic.
 */
export const removeClipFromTopic = mutation({
  args: {
    clipId: v.id('clips'),
    topicId: v.id('topics'),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const association = await ctx.db
      .query('clipsOnTopics')
      .withIndex('by_clipId_and_topicId', (q) =>
        q.eq('clipId', args.clipId).eq('topicId', args.topicId),
      )
      .first();

    if (!association) {
      throwNotFound('Association not found', { resource: 'clipsOnTopics' });
    }

    await ctx.db.delete(association._id);

    return null;
  },
  returns: v.null(),
});

/**
 * Remove a talk from a topic.
 */
export const removeTalkFromTopic = mutation({
  args: {
    talkId: v.id('talks'),
    topicId: v.id('topics'),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const association = await ctx.db
      .query('talksOnTopics')
      .withIndex('by_talkId_and_topicId', (q) =>
        q.eq('talkId', args.talkId).eq('topicId', args.topicId),
      )
      .first();

    if (!association) {
      throwNotFound('Association not found', { resource: 'talksOnTopics' });
    }

    await ctx.db.delete(association._id);

    return null;
  },
  returns: v.null(),
});

/**
 * Update an existing topic.
 */
export const updateTopic = mutation({
  args: {
    id: v.id('topics'),
    description: v.optional(v.string()),
    status: v.optional(topicStatus),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const { id, ...rest } = args;
    const updates: Partial<Doc<'topics'>> = rest;

    const topic = await ctx.db.get('topics', id);

    if (!topic) {
      throwNotFound('Topic not found', { resource: 'topic', resourceId: id });
    }

    if (updates.title !== undefined) {
      // Validate input early
      if (!updates.title.trim()) {
        throwValidationError('Title cannot be empty', 'title');
      }

      const newSlug = await generateSlug(ctx, 'topics', updates.title, id);

      if (newSlug !== topic.slug) {
        updates.slug = newSlug;
      }
    }

    updates.updatedAt = Date.now();

    await ctx.db.patch(id, updates);

    return id;
  },
  returns: v.id('topics'),
});
