import type { MutationCtx } from '../../_generated/server';
import type {
  ArchiveTalkArgs,
  CreateTalkArgs,
  UpdateTalkArgs,
  UpdateTalkStatusArgs,
} from './types';

import { Doc } from '../../_generated/dataModel';
import { normalizeSlug, slugExists } from '../../lib/utils';
import { requireAuth } from '../auth/queries';

/**
 * Create a new talk.
 *
 * @param ctx - Database context
 * @param args - Talk creation arguments
 * @returns The ID of the created talk
 */
export async function createTalk(ctx: MutationCtx, args: CreateTalkArgs) {
  await requireAuth(ctx);

  const slug = normalizeSlug(args.title);

  if (await slugExists(ctx, 'talks', slug)) {
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
}

/**
 * Update an existing talk.
 *
 * @param ctx - Database context
 * @param args - Update arguments
 * @returns The ID of the updated talk
 */
export async function updateTalk(ctx: MutationCtx, args: UpdateTalkArgs) {
  await requireAuth(ctx);

  const { id, ...rest } = args;
  const updates: Partial<Doc<'talks'>> = rest;
  const talk = await ctx.db.get(id);

  if (!talk) {
    throw new Error('Talk not found');
  }

  // If title changed, update slug
  if (updates.title) {
    const newSlug = normalizeSlug(updates.title);

    if (newSlug !== talk.slug) {
      if (await slugExists(ctx, 'talks', newSlug, id)) {
        throw new Error('Talk with this title already exists');
      }

      updates.slug = newSlug;
    }
  }

  // Handle status changes
  if (updates.status) {
    if (updates.status === 'published' && !talk.publishedAt) {
      updates.publishedAt = Date.now();
    } else if (updates.status !== 'published') {
      updates.publishedAt = undefined;
    }
  }

  updates.updatedAt = Date.now();

  await ctx.db.patch(id, updates);

  return id;
}

/**
 * Update talk status.
 *
 * @param ctx - Database context
 * @param args - Update arguments
 * @returns The ID of the updated talk
 */
export async function updateTalkStatus(ctx: MutationCtx, args: UpdateTalkStatusArgs) {
  await requireAuth(ctx);

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
}

/**
 * Archive a talk (soft delete by setting status to archived).
 *
 * @param ctx - Database context
 * @param args - Archive arguments
 * @returns null
 */
export async function archiveTalk(ctx: MutationCtx, args: ArchiveTalkArgs) {
  await requireAuth(ctx);

  const talk = await ctx.db.get(args.id);

  if (!talk) {
    throw new Error('Talk not found');
  }

  // Soft delete by setting status to archived
  await ctx.db.patch(args.id, {
    publishedAt: undefined,
    status: 'archived',
    updatedAt: Date.now(),
  });

  return null;
}
