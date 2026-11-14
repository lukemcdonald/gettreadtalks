import type { Doc } from '../../_generated/dataModel';

import { getOneFrom } from 'convex-helpers/server/relationships';
import { v } from 'convex/values';

import { mutation } from '../../_generated/server';
import { throwNotFound, throwValidationError } from '../../lib/errors';
import { generateSlug } from '../../lib/utils';
import { requireAdmin } from '../auth/helpers';
import { toTopicUpdates } from './helpers';

/**
 * Create a new topic.
 */
export const createTopic = mutation({
  args: {
    description: v.optional(v.string()),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    // Validate input early
    if (!args.title.trim()) {
      throwValidationError('Title cannot be empty', 'title');
    }

    const slug = await generateSlug(ctx, {
      baseText: args.title,
      table: 'topics',
    });

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
    await requireAdmin(ctx);

    const topic = await ctx.db.get('topics', args.id);

    if (!topic) {
      throwNotFound('Topic not found', {
        resource: 'topic',
        resourceId: args.id,
      });
    }

    // Check if topic is referenced by any talks
    const talksWithTopic = await getOneFrom(
      ctx.db,
      'talksOnTopics',
      'by_topicId',
      args.id
    );

    if (talksWithTopic) {
      throwValidationError('Cannot delete topic: topic has associated talks');
    }

    // Hard delete the topic
    await ctx.db.delete(args.id);

    return null;
  },
  returns: v.null(),
});

/**
 * Update an existing topic.
 */
export const updateTopic = mutation({
  args: {
    description: v.optional(v.string()),
    id: v.id('topics'),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const { id, ...rest } = args;
    const updates: Partial<Doc<'topics'>> = toTopicUpdates(rest);

    const topic = await ctx.db.get('topics', id);

    if (!topic) {
      throwNotFound('Topic not found', { resource: 'topic', resourceId: id });
    }

    if (updates.title !== undefined) {
      // Validate input early
      if (!updates.title.trim()) {
        throwValidationError('Title cannot be empty', 'title');
      }

      const newSlug = await generateSlug(ctx, {
        baseText: updates.title,
        excludeId: id,
        table: 'topics',
      });

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
