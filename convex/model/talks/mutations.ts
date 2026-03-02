import type { Doc } from '../../_generated/dataModel';

import { v } from 'convex/values';
import { getManyFrom } from 'convex-helpers/server/relationships';

import { mutation } from '../../_generated/server';
import { throwDuplicateSlug, throwValidationError } from '../../lib/errors';
import {
  deleteAll,
  getOrThrow,
  getPublishedAtForStatus,
  slugify,
  talkSlugExistsForSpeaker,
} from '../../lib/utils';
import { requireAuth } from '../auth/utils';
import { statusType } from './validators';

/**
 * Archive a talk (soft delete by setting status to archived).
 */
export const archiveTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    const { talkId } = args;

    await requireAuth(ctx);

    const talk = await getOrThrow(ctx, 'talks', talkId);

    const isArchived = talk.status === 'archived';
    const newStatus = isArchived ? 'backlog' : 'archived';

    await ctx.db.patch(talkId, {
      publishedAt: isArchived ? undefined : talk.publishedAt,
      status: newStatus,
      updatedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

/**
 * Create a new talk.
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
    const publishedAt = getPublishedAtForStatus(status);

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
 */
export const updateTalk = mutation({
  args: {
    collectionId: v.optional(v.id('collections')),
    collectionOrder: v.optional(v.number()),
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    mediaUrl: v.optional(v.string()),
    scripture: v.optional(v.string()),
    slug: v.optional(v.string()),
    speakerId: v.optional(v.id('speakers')),
    status: v.optional(statusType),
    talkId: v.id('talks'),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { slug: rawSlug, talkId, ...rest } = args;

    await requireAuth(ctx);

    const updates: Partial<Doc<'talks'>> = rest;
    const talk = await getOrThrow(ctx, 'talks', talkId);
    const speakerIdToCheck = updates.speakerId || talk.speakerId;

    if (updates.title !== undefined && !updates.title.trim()) {
      throwValidationError('Title cannot be empty', 'title');
    }

    // Use explicit slug if provided, otherwise keep existing slug
    if (rawSlug !== undefined) {
      const newSlug = slugify(rawSlug);

      if (!newSlug) {
        throwValidationError('Slug cannot be empty', 'slug');
      }

      if (newSlug !== talk.slug) {
        if (await talkSlugExistsForSpeaker(ctx, speakerIdToCheck, newSlug, talkId)) {
          throwDuplicateSlug('A talk with this slug already exists for this speaker', 'slug');
        }

        updates.slug = newSlug;
      }
    }

    if (updates.status) {
      updates.publishedAt = getPublishedAtForStatus(updates.status, talk.publishedAt);
    }

    updates.updatedAt = Date.now();

    await ctx.db.patch(talkId, updates);

    return talkId;
  },
  returns: v.id('talks'),
});

/**
 * Update talk status.
 */
export const updateTalkStatus = mutation({
  args: {
    talkId: v.id('talks'),
    status: statusType,
  },
  handler: async (ctx, args) => {
    const { talkId } = args;

    await requireAuth(ctx);

    const talk = await getOrThrow(ctx, 'talks', talkId);

    const updates: Partial<Doc<'talks'>> = {
      publishedAt: getPublishedAtForStatus(args.status, talk.publishedAt),
      status: args.status,
    };

    updates.updatedAt = Date.now();

    await ctx.db.patch(talkId, updates);

    return talkId;
  },
  returns: v.id('talks'),
});

/**
 * Destroy a talk (permanently delete from database with cleanup of related records).
 */
export const destroyTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    const { talkId } = args;

    await requireAuth(ctx);

    const talk = await getOrThrow(ctx, 'talks', talkId);

    const talksOnTopics = await ctx.db
      .query('talksOnTopics')
      .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
      .collect();

    await deleteAll(ctx, talksOnTopics);

    const favorites = await ctx.db
      .query('userFavoriteTalks')
      .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
      .collect();

    await deleteAll(ctx, favorites);

    const finished = await ctx.db
      .query('userFinishedTalks')
      .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
      .collect();

    await deleteAll(ctx, finished);

    // Clips remain intact - talkId is optional and nullability is intentional

    await ctx.db.delete(talkId);

    return null;
  },
  returns: v.null(),
});
