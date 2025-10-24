import type { Doc, Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';

import { normalizeSlug, slugExists } from '../../lib/utils';
import { requireAuth } from '../auth/queries';

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
    status?: 'approved' | 'archived' | 'backlog' | 'published';
    talkId?: Id<'talks'>;
    title: string;
  },
) {
  await requireAuth(ctx);

  const slug = normalizeSlug(args.title);

  if (await slugExists(ctx, 'clips', slug)) {
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
 * Update an existing clip.
 *
 * @param ctx - Database context
 * @param args - Update arguments
 * @returns The ID of the updated clip
 */
export async function updateClip(
  ctx: MutationCtx,
  args: {
    description?: string;
    id: Id<'clips'>;
    mediaUrl?: string;
    speakerId?: Id<'speakers'>;
    status?: 'approved' | 'archived' | 'backlog' | 'published';
    talkId?: Id<'talks'>;
    title?: string;
  },
) {
  await requireAuth(ctx);

  const { id, ...rest } = args;
  const updates: Partial<Doc<'clips'>> = rest;
  const clip = await ctx.db.get(id);

  if (!clip) {
    throw new Error('Clip not found');
  }

  // If title changed, update slug
  if (updates.title) {
    const newSlug = normalizeSlug(updates.title);

    if (newSlug !== clip.slug) {
      if (await slugExists(ctx, 'clips', newSlug, id)) {
        throw new Error('Clip with this title already exists');
      }

      updates.slug = newSlug;
    }
  }

  // Handle status changes
  if (updates.status) {
    if (updates.status === 'published' && !clip.publishedAt) {
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
  await requireAuth(ctx);

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

/**
 * Archive a clip (soft delete by setting status to archived).
 *
 * @param ctx - Database context
 * @param args - Archive arguments
 * @returns null
 */
export async function archiveClip(
  ctx: MutationCtx,
  args: {
    id: Id<'clips'>;
  },
) {
  await requireAuth(ctx);

  const clip = await ctx.db.get(args.id);

  if (!clip) {
    throw new Error('Clip not found');
  }

  // Soft delete by setting status to archived
  await ctx.db.patch(args.id, {
    publishedAt: undefined,
    status: 'archived',
    updatedAt: Date.now(),
  });

  return null;
}
