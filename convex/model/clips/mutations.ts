import type { Doc } from '../../_generated/dataModel';

import { getManyFrom } from 'convex-helpers/server/relationships';
import { v } from 'convex/values';

import { mutation } from '../../_generated/server';
import { throwValidationError } from '../../lib/errors';
import {
  deleteAll,
  generateSlug,
  getOrThrow,
  getPublishedAtForStatus,
} from '../../lib/utils';
import { requireAdmin } from '../auth/helpers';
import {
  clearMediaChecksForEntity,
  clearStaleMediaChecks,
} from '../mediaHealth/check/clear';
import { statusType } from './validators';

/**
 * Archive a clip (soft delete by setting status to archived).
 */
export const archiveClip = mutation({
  args: {
    clipId: v.id('clips'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    await getOrThrow(ctx, 'clips', args.clipId);

    await ctx.db.patch(args.clipId, {
      publishedAt: undefined,
      status: 'archived',
      updatedAt: Date.now(),
    });

    await clearMediaChecksForEntity(ctx, {
      entityId: args.clipId,
      entityTable: 'clips',
    });

    return null;
  },
  returns: v.null(),
});

/**
 * Destroy a clip (permanently delete from database).
 */
export const destroyClip = mutation({
  args: {
    clipId: v.id('clips'),
  },
  handler: async (ctx, args) => {
    const { clipId } = args;

    await requireAdmin(ctx);

    await getOrThrow(ctx, 'clips', clipId);

    await clearMediaChecksForEntity(ctx, {
      entityId: clipId,
      entityTable: 'clips',
    });

    const favorites = await getManyFrom(
      ctx.db,
      'userFavoriteClips',
      'by_clipId',
      clipId
    );

    await deleteAll(ctx, favorites);

    await ctx.db.delete(clipId);

    return null;
  },
  returns: v.null(),
});

/**
 * Create a new clip.
 */
export const createClip = mutation({
  args: {
    description: v.optional(v.string()),
    mediaUrl: v.string(),
    speakerId: v.optional(v.id('speakers')),
    status: v.optional(statusType),
    talkId: v.optional(v.id('talks')),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    if (!args.title.trim()) {
      throwValidationError('Title cannot be empty', 'title');
    }

    const slug = await generateSlug(ctx, 'clips', args.title);

    const status = args.status ?? 'backlog';
    const publishedAt = getPublishedAtForStatus(status);

    return await ctx.db.insert('clips', {
      ...args,
      publishedAt,
      slug,
      status,
    });
  },
  returns: v.id('clips'),
});

/**
 * Update an existing clip.
 */
export const updateClip = mutation({
  args: {
    clipId: v.id('clips'),
    description: v.optional(v.string()),
    mediaUrl: v.optional(v.string()),
    speakerId: v.optional(v.id('speakers')),
    status: v.optional(statusType),
    talkId: v.optional(v.id('talks')),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const { clipId, ...rest } = args;
    const updates: Partial<Doc<'clips'>> = rest;

    const clip = await getOrThrow(ctx, 'clips', clipId);

    // If title changed, update slug
    if (updates.title !== undefined) {
      if (!updates.title.trim()) {
        throwValidationError('Title cannot be empty', 'title');
      }

      const newSlug = await generateSlug(ctx, 'clips', updates.title, clipId);

      if (newSlug !== clip.slug) {
        updates.slug = newSlug;
      }
    }

    if (updates.status) {
      updates.publishedAt = getPublishedAtForStatus(
        updates.status,
        clip.publishedAt
      );
    }

    updates.updatedAt = Date.now();

    await ctx.db.patch(clipId, updates);

    await clearStaleMediaChecks(ctx, {
      entityId: clipId,
      entityTable: 'clips',
      nextMediaUrl: updates.mediaUrl,
      nextStatus: updates.status,
      previousMediaUrl: clip.mediaUrl,
      previousStatus: clip.status,
    });

    return clipId;
  },
  returns: v.id('clips'),
});
