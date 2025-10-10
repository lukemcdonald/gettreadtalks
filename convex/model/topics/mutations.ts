import type { MutationCtx } from '../../_generated/server';

import { Doc } from '../../_generated/dataModel';
import { normalizeSlug, slugExists } from '../../lib/utils';
import { requireAuth } from '../auth/queries';
import type { CreateTopicArgs, DeleteTopicArgs, UpdateTopicArgs } from './types';

/**
 * Create a new topic.
 *
 * @param ctx - Database context
 * @param args - Topic creation arguments
 * @returns The ID of the created topic
 */
export async function createTopic(ctx: MutationCtx, args: CreateTopicArgs) {
  await requireAuth(ctx);

  const slug = normalizeSlug(args.title);

  if (await slugExists(ctx, 'topics', slug)) {
    throw new Error('Topic with this title already exists');
  }

  return await ctx.db.insert('topics', {
    ...args,
    slug,
  });
}

/**
 * Update an existing topic.
 *
 * @param ctx - Database context
 * @param args - Update arguments
 * @returns The ID of the updated topic
 */
export async function updateTopic(ctx: MutationCtx, args: UpdateTopicArgs) {
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
      if (await slugExists(ctx, 'topics', newSlug, id)) {
        throw new Error('Topic with this title already exists');
      }

      updates.slug = newSlug;
    }
  }

  updates.updatedAt = Date.now();

  await ctx.db.patch(id, updates);

  return id;
}

/**
 * Delete a topic (hard delete with reference checks).
 *
 * @param ctx - Database context
 * @param args - Delete arguments
 * @returns null
 */
export async function deleteTopic(ctx: MutationCtx, args: DeleteTopicArgs) {
  await requireAuth(ctx);

  const topic = await ctx.db.get(args.id);

  if (!topic) {
    throw new Error('Topic not found');
  }

  // Check if topic is referenced by any talks
  const talksWithTopic = await ctx.db
    .query('talksOnTopics')
    .withIndex('by_topic_id', (q) => q.eq('topicId', args.id))
    .first();

  if (talksWithTopic) {
    throw new Error('Cannot delete topic: topic has associated talks');
  }

  // Check if topic is referenced by any clips
  const clipsWithTopic = await ctx.db
    .query('clipsOnTopics')
    .withIndex('by_topic_id', (q) => q.eq('topicId', args.id))
    .first();

  if (clipsWithTopic) {
    throw new Error('Cannot delete topic: topic has associated clips');
  }

  // Hard delete the topic
  await ctx.db.delete(args.id);

  return null;
}
