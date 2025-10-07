import { Doc, Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';
import { StatusType } from '../../schema';
import { normalizeSlug } from '../../utils';
import { requireAuth } from '../auth/queries';

/**
 * Create a new talk.
 *
 * @param ctx - Database context
 * @param args - Talk creation arguments
 * @returns The ID of the created talk
 */
export async function createTalk(
  ctx: MutationCtx,
  args: {
    collectionId?: Id<'collections'>;
    collectionOrder?: number;
    mediaUrl: string;
    scripture?: string;
    speakerId: Id<'speakers'>;
    status?: StatusType;
    title: string;
  },
) {
  await requireAuth(ctx);

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
}

/**
 * Update talk status.
 *
 * @param ctx - Database context
 * @param args - Update arguments
 * @returns The ID of the updated talk
 */
export async function updateTalkStatus(
  ctx: MutationCtx,
  args: {
    id: Id<'talks'>;
    status: StatusType;
  },
) {
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
