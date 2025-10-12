import type { MutationCtx } from '../../_generated/server';
import type { CreateTopicArgs, DestroyTopicArgs, UpdateTopicArgs } from './types';

import { Doc, Id } from '../../_generated/dataModel';
import { throwDuplicateSlug, throwNotFound, throwValidationError } from '../../lib/errors';
import { normalizeSlug, slugExists } from '../../lib/utils';
import { requireAuth } from '../auth/queries';

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
    throwDuplicateSlug('Topic with this title already exists', 'title');
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
    throwNotFound('Topic not found', { resource: 'topic', resourceId: id });
  }

  if (updates.title) {
    const newSlug = normalizeSlug(updates.title);

    if (newSlug !== topic.slug) {
      if (await slugExists(ctx, 'topics', newSlug, id)) {
        throwDuplicateSlug('Topic with this title already exists', 'title');
      }

      updates.slug = newSlug;
    }
  }

  updates.updatedAt = Date.now();

  await ctx.db.patch(id, updates);

  return id;
}

/**
 * Destroy a topic (permanently delete from database with reference checks).
 *
 * @param ctx - Database context
 * @param args - Destroy arguments
 * @returns null
 */
export async function destroyTopic(ctx: MutationCtx, args: DestroyTopicArgs) {
  await requireAuth(ctx);

  const topic = await ctx.db.get(args.id);

  if (!topic) {
    throwNotFound('Topic not found', { resource: 'topic', resourceId: args.id });
  }

  // Check if topic is referenced by any talks
  const talksWithTopic = await ctx.db
    .query('talksOnTopics')
    .withIndex('by_topic_id', (q) => q.eq('topicId', args.id))
    .first();

  if (talksWithTopic) {
    throwValidationError('Cannot delete topic: topic has associated talks');
  }

  // Check if topic is referenced by any clips
  const clipsWithTopic = await ctx.db
    .query('clipsOnTopics')
    .withIndex('by_topic_id', (q) => q.eq('topicId', args.id))
    .first();

  if (clipsWithTopic) {
    throwValidationError('Cannot delete topic: topic has associated clips');
  }

  // Hard delete the topic
  await ctx.db.delete(args.id);

  return null;
}

/**
 * Add a talk to a topic.
 *
 * @param ctx - Database context
 * @param args - Arguments containing talkId and topicId
 * @returns The ID of the created association
 */
export async function addTalkToTopic(
  ctx: MutationCtx,
  args: {
    talkId: Id<'talks'>;
    topicId: Id<'topics'>;
  },
) {
  await requireAuth(ctx);

  const talk = await ctx.db.get(args.talkId);
  if (!talk) {
    throwNotFound('Talk not found', { resource: 'talk', resourceId: args.talkId });
  }

  const topic = await ctx.db.get(args.topicId);
  if (!topic) {
    throwNotFound('Topic not found', { resource: 'topic', resourceId: args.topicId });
  }

  const existing = await ctx.db
    .query('talksOnTopics')
    .withIndex('by_talk_id_and_topic_id', (q) =>
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
}

/**
 * Remove a talk from a topic.
 *
 * @param ctx - Database context
 * @param args - Arguments containing talkId and topicId
 * @returns null
 */
export async function removeTalkFromTopic(
  ctx: MutationCtx,
  args: {
    talkId: Id<'talks'>;
    topicId: Id<'topics'>;
  },
) {
  await requireAuth(ctx);

  const association = await ctx.db
    .query('talksOnTopics')
    .withIndex('by_talk_id_and_topic_id', (q) =>
      q.eq('talkId', args.talkId).eq('topicId', args.topicId),
    )
    .first();

  if (!association) {
    throwNotFound('Association not found', { resource: 'talksOnTopics' });
  }

  await ctx.db.delete(association._id);

  return null;
}

/**
 * Add a clip to a topic.
 *
 * @param ctx - Database context
 * @param args - Arguments containing clipId and topicId
 * @returns The ID of the created association
 */
export async function addClipToTopic(
  ctx: MutationCtx,
  args: {
    clipId: Id<'clips'>;
    topicId: Id<'topics'>;
  },
) {
  await requireAuth(ctx);

  const clip = await ctx.db.get(args.clipId);
  if (!clip) {
    throwNotFound('Clip not found', { resource: 'clip', resourceId: args.clipId });
  }

  const topic = await ctx.db.get(args.topicId);
  if (!topic) {
    throwNotFound('Topic not found', { resource: 'topic', resourceId: args.topicId });
  }

  const existing = await ctx.db
    .query('clipsOnTopics')
    .withIndex('by_clip_id_and_topic_id', (q) =>
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
}

/**
 * Remove a clip from a topic.
 *
 * @param ctx - Database context
 * @param args - Arguments containing clipId and topicId
 * @returns null
 */
export async function removeClipFromTopic(
  ctx: MutationCtx,
  args: {
    clipId: Id<'clips'>;
    topicId: Id<'topics'>;
  },
) {
  await requireAuth(ctx);

  const association = await ctx.db
    .query('clipsOnTopics')
    .withIndex('by_clip_id_and_topic_id', (q) =>
      q.eq('clipId', args.clipId).eq('topicId', args.topicId),
    )
    .first();

  if (!association) {
    throwNotFound('Association not found', { resource: 'clipsOnTopics' });
  }

  await ctx.db.delete(association._id);

  return null;
}
