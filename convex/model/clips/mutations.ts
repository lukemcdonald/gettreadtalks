import type { Doc } from '../../_generated/dataModel';

import { v } from 'convex/values';

import { mutation } from '../../_generated/server';
import { normalizeSlug, slugExists } from '../../lib/utils';
import { requireAuth } from '../auth/utils';
import { statusType } from './validators';
/**
 * Archive a clip (soft delete by setting status to archived).
 *
 * @param ctx - Database context
 * @param args - Archive arguments
 * @returns null
 */
export const archiveClip = mutation({
  args: {
    id: v.id('clips'),
  },
  handler: async (ctx, args) => {
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
  },
  returns: v.null(),
});

/**
 * Create a new clip.
 *
 * @param ctx - Database context
 * @param args - Clip creation arguments
 * @returns The ID of the created clip
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
  },
  returns: v.id('clips'),
});

/**
 * Update an existing clip.
 *
 * @param ctx - Database context
 * @param args - Update arguments
 * @returns The ID of the updated clip
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
  },
  returns: v.id('clips'),
});

/**
 * Update clip status.
 *
 * @param ctx - Database context
 * @param args - Update arguments
 * @returns The ID of the updated clip
 */
export const updateClipStatus = mutation({
  args: {
    id: v.id('clips'),
    status: statusType,
  },
  handler: async (ctx, args) => {
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
  },
  returns: v.id('clips'),
});
