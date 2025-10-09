import type { MutationCtx } from '../../_generated/server';

import { Doc } from '../../_generated/dataModel';
import { normalizeSlug, slugExists } from '../../lib/utils';
import { requireAuth } from '../auth/queries';
import type { CreateTalkArgs, UpdateTalkStatusArgs } from './types';

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
