import type { MutationCtx } from '../../_generated/server';

import { Doc, Id } from '../../_generated/dataModel';
import { normalizeSlug, slugExists } from '../../lib/utils';
import { requireAuth } from '../auth/queries';
import type {
  AddClipToTopicArgs,
  AddTalkToTopicArgs,
  CreateTopicArgs,
  DestroyTopicArgs,
  RemoveClipFromTopicArgs,
  RemoveTalkFromTopicArgs,
  UpdateTopicArgs,
} from './types';

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
    throw new Error('Talk not found');
  }

  const topic = await ctx.db.get(args.topicId);
  if (!topic) {
    throw new Error('Topic not found');
  }

  const existing = await ctx.db
    .query('talksOnTopics')
    .withIndex('by_talk_id_and_topic_id', (q) =>
      q.eq('talkId', args.talkId).eq('topicId', args.topicId),
    )
    .unique();

  if (existing) {
    throw new Error('Talk is already associated with this topic');
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
    throw new Error('Association not found');
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
    throw new Error('Clip not found');
  }

  const topic = await ctx.db.get(args.topicId);
  if (!topic) {
    throw new Error('Topic not found');
  }

  const existing = await ctx.db
    .query('clipsOnTopics')
    .withIndex('by_clip_id_and_topic_id', (q) =>
      q.eq('clipId', args.clipId).eq('topicId', args.topicId),
    )
    .unique();

  if (existing) {
    throw new Error('Clip is already associated with this topic');
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
    throw new Error('Association not found');
  }

  await ctx.db.delete(association._id);

  return null;
}
