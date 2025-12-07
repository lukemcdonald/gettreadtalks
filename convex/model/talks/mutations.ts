import type { Doc } from '../../_generated/dataModel';

import { v } from 'convex/values';

import { mutation } from '../../_generated/server';
import { throwDuplicateSlug, throwNotFound, throwValidationError } from '../../lib/errors';
import { slugify, talkSlugExistsForSpeaker } from '../../lib/utils';
import { requireAuth } from '../auth/utils';
import { statusType } from './validators';

/**
 * Archive a talk (soft delete by setting status to archived).
 *
 * @param ctx - Database context
 * @param args - Archive arguments
 * @returns null
 */
export const archiveTalk = mutation({
  args: {
    id: v.id('talks'),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const talk = await ctx.db.get(args.id);

    if (!talk) {
      throwNotFound('Talk not found', { resource: 'talk', resourceId: args.id });
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
 * Create a new talk.
 *
 * @param ctx - Database context
 * @param args - Talk creation arguments
 * @returns The ID of the created talk
 */
export const createTalk = mutation({
  args: {
    collectionId: v.optional(v.id('collections')),
    collectionOrder: v.optional(v.number()),
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    mediaUrl: v.string(),
    scripture: v.optional(v.string()),
    speakerId: v.id('speakers'),
    status: v.optional(statusType),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    if (!args.title.trim()) {
      throwValidationError('Title cannot be empty', 'title');
    }

    const slug = slugify(args.title);

    if (await talkSlugExistsForSpeaker(ctx, args.speakerId, slug)) {
      throwDuplicateSlug('Talk with this title already exists for this speaker', 'title');
    }

    const status = args.status || 'backlog';
    const publishedAt = status === 'published' ? Date.now() : undefined;

    return await ctx.db.insert('talks', {
      ...args,
      publishedAt,
      slug,
      status,
    });
  },
  returns: v.id('talks'),
});

/**
 * Update an existing talk.
 *
 * @param ctx - Database context
 * @param args - Update arguments
 * @returns The ID of the updated talk
 */
export const updateTalk = mutation({
  args: {
    collectionId: v.optional(v.id('collections')),
    collectionOrder: v.optional(v.number()),
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    id: v.id('talks'),
    mediaUrl: v.optional(v.string()),
    scripture: v.optional(v.string()),
    speakerId: v.optional(v.id('speakers')),
    status: v.optional(statusType),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const { id, ...rest } = args;
    const updates: Partial<Doc<'talks'>> = rest;
    const talk = await ctx.db.get(id);

    if (!talk) {
      throwNotFound('Talk not found', { resource: 'talk', resourceId: id });
    }

    // If title changed, update slug
    if (updates.title !== undefined) {
      // Validate input early
      if (!updates.title.trim()) {
        throwValidationError('Title cannot be empty', 'title');
      }

      const newSlug = slugify(updates.title);

      if (newSlug !== talk.slug) {
        // Use the speakerId from the talk or from updates if it's being changed
        const speakerIdToCheck = updates.speakerId || talk.speakerId;
        const slugExists = await talkSlugExistsForSpeaker(ctx, speakerIdToCheck, newSlug, id);

        if (slugExists) {
          throwDuplicateSlug('Talk with this title already exists for this speaker', 'title');
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
  },
  returns: v.id('talks'),
});

/**
 * Update talk status.
 *
 * @param ctx - Database context
 * @param args - Update arguments
 * @returns The ID of the updated talk
 */
export const updateTalkStatus = mutation({
  args: {
    id: v.id('talks'),
    status: statusType,
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const talk = await ctx.db.get(args.id);

    if (!talk) {
      throwNotFound('Talk not found', { resource: 'talk', resourceId: args.id });
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
  },
  returns: v.id('talks'),
});
