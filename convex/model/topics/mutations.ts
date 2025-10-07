import type { MutationCtx } from '../../_generated/server';

import { Doc, Id } from '../../_generated/dataModel';
import { normalizeSlug, slugExists } from '../../lib/utils';
import { requireAuth } from '../auth/queries';

/**
 * Create a new topic.
 *
 * @param ctx - Database context
 * @param args - Topic creation arguments
 * @returns The ID of the created topic
 */
export async function createTopic(
  ctx: MutationCtx,
  args: {
    title: string;
  },
) {
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
export async function updateTopic(
  ctx: MutationCtx,
  args: {
    id: Id<'topics'>;
    title?: string;
  },
) {
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
