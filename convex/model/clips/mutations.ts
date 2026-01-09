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
    id: v.id('clips'),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    await getOrThrow(ctx, 'clips', args.id);

    // Soft delete by setting status to archived
    await ctx.db.patch(args.id, {
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

    // Validate input early
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
    id: v.id('clips'),
    mediaUrl: v.optional(v.string()),
    speakerId: v.optional(v.id('speakers')),
    status: v.optional(statusType),
    talkId: v.optional(v.id('talks')),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const { id, ...rest } = args;
    const updates: Partial<Doc<'clips'>> = rest;
    const clip = await getOrThrow(ctx, 'clips', id);

    // If title changed, update slug
    if (updates.title !== undefined) {
      // Validate input early
      if (!updates.title.trim()) {
        throwValidationError('Title cannot be empty', 'title');
      }

      const newSlug = await generateSlug(ctx, 'clips', updates.title, id);

      if (newSlug !== clip.slug) {
        updates.slug = newSlug;
      }
    }

    // Handle status changes
    if (updates.status) {
      updates.publishedAt = getPublishedAtForStatus(updates.status, clip.publishedAt);
    }

    updates.updatedAt = Date.now();

    await ctx.db.patch(id, updates);

    return id;
  },
  returns: v.id('clips'),
});

/**
 * Update clip status.
 */
export const updateClipStatus = mutation({
  args: {
    id: v.id('clips'),
    status: statusType,
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const clip = await getOrThrow(ctx, 'clips', args.id);

    const updates: Partial<Doc<'clips'>> = {
      publishedAt: getPublishedAtForStatus(args.status, clip.publishedAt),
      status: args.status,
    };

    updates.updatedAt = Date.now();

    await ctx.db.patch(args.id, updates);

    return args.id;
  },
  returns: v.id('clips'),
});
