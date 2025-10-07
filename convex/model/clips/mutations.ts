import { Doc, Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';
import { normalizeSlug } from '../../lib/utils';
import { requireAuth } from '../auth/queries';
import { StatusType } from '../../lib/validators';

/**
 * Create a new clip.
 *
 * @param ctx - Database context
 * @param args - Clip creation arguments
 * @returns The ID of the created clip
 */
export async function createClip(
  ctx: MutationCtx,
  args: {
    description?: string;
    mediaUrl: string;
    speakerId?: Id<'speakers'>;
    status?: StatusType;
    talkId?: Id<'talks'>;
    title: string;
  },
) {
  await requireAuth(ctx);

  const slug = normalizeSlug(args.title);

  const existing = await ctx.db
    .query('clips')
    .withIndex('by_slug', (q) => q.eq('slug', slug))
    .first();

  if (existing) {
    throw new Error('Clip with this title already exists');
  }

  const status = args.status ?? 'backlog';
  const publishedAt = status === 'published' ? Date.now() : undefined;

  return await ctx.db.insert('clips', {
    ...args,
    publishedAt,
    slug,
    status,
  });
}

/**
 * Update clip status.
 *
 * @param ctx - Database context
 * @param args - Update arguments
 * @returns The ID of the updated clip
 */
export async function updateClipStatus(
  ctx: MutationCtx,
  args: {
    id: Id<'clips'>;
    status: 'approved' | 'archived' | 'backlog' | 'published';
  },
) {
  const user = await requireAuth(ctx);
  const clip: Doc<'clips'> | null = await ctx.db.get(args.id);

  if (!clip) {
    throw new Error('Clip not found');
  }

  const updates: Partial<Doc<'clips'>> = {
    status: args.status,
  };

  if (args.status === 'published' && !clip.publishedAt) {
    updates.publishedAt = Date.now();
  } else if (args.status !== 'published') {
    updates.publishedAt = undefined;
  }

  updates.updatedAt = Date.now();

  await ctx.db.patch(args.id, updates);

  return args.id;
}
