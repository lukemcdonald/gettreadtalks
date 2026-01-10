import type { Doc } from '../../_generated/dataModel';

import { v } from 'convex/values';

import { mutation } from '../../_generated/server';
import { throwValidationError } from '../../lib/errors';
import { generateSlug, getOrThrow, getPublishedAtForStatus, slugify } from '../../lib/utils';
import { requireAuth } from '../auth/utils';
import { statusType } from './validators';
/**
 * Archive a clip (soft delete by setting status to archived).
 */
export const archiveClip = mutation({
  args: {
    clipId: v.id('clips'),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    await getOrThrow(ctx, 'clips', args.clipId);

    await ctx.db.patch(args.clipId, {
      publishedAt: undefined,
      status: 'archived',
      updatedAt: Date.now(),
    });

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
    await requireAuth(ctx);

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
    description: v.optional(v.string()),
    clipId: v.id('clips'),
    mediaUrl: v.optional(v.string()),
    speakerId: v.optional(v.id('speakers')),
    status: v.optional(statusType),
    talkId: v.optional(v.id('talks')),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    // TODO: Do we really need to destructure clipId off of args?
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
      updates.publishedAt = getPublishedAtForStatus(updates.status, clip.publishedAt);
    }

    updates.updatedAt = Date.now();

    await ctx.db.patch(clipId, updates);

    return clipId;
  },
  returns: v.id('clips'),
});

/**
 * Update clip status.
 */
export const updateClipStatus = mutation({
  args: {
    clipId: v.id('clips'),
    status: statusType,
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const clip = await getOrThrow(ctx, 'clips', args.clipId);

    const updates: Partial<Doc<'clips'>> = {
      publishedAt: getPublishedAtForStatus(args.status, clip.publishedAt),
      status: args.status,
    };

    updates.updatedAt = Date.now();

    await ctx.db.patch(args.clipId, updates);

    return args.clipId;
  },
  returns: v.id('clips'),
});
