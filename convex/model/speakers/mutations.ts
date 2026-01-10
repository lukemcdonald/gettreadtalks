import type { Doc } from '../../_generated/dataModel';

import { v } from 'convex/values';
import { getManyFrom, getOneFrom } from 'convex-helpers/server/relationships';

import { mutation } from '../../_generated/server';
import { throwDuplicateSlug, throwValidationError } from '../../lib/errors';
import { deleteAll, getOrThrow, slugExists, slugify } from '../../lib/utils';
import { requireAuth } from '../auth/utils';

/**
 * Create a new speaker.
 */
export const createSpeaker = mutation({
  args: {
    description: v.optional(v.string()),
    firstName: v.string(),
    imageUrl: v.optional(v.string()),
    lastName: v.string(),
    ministry: v.optional(v.string()),
    role: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    if (!args.firstName.trim()) {
      throwValidationError('First name cannot be empty', 'firstName');
    }

    if (!args.lastName.trim()) {
      throwValidationError('Last name cannot be empty', 'lastName');
    }

    const slug = slugify(`${args.firstName} ${args.lastName}`);

    if (await slugExists(ctx, 'speakers', slug)) {
      throwDuplicateSlug('Speaker with this name already exists', 'firstName');
    }

    return await ctx.db.insert('speakers', {
      ...args,
      slug,
    });
  },
  returns: v.id('speakers'),
});

/**
 * Destroy a speaker (permanently delete from database with reference checks).
 */
export const destroySpeaker = mutation({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    const { speakerId } = args;

    await requireAuth(ctx);

    const speaker = await getOrThrow(ctx, 'speakers', speakerId);

    // Prevent deletion if speaker has associated content
    const talksWithSpeaker = await getOneFrom(
      ctx.db,
      'talks',
      'by_speakerId_and_status',
      speakerId,
      'speakerId',
    );

    if (talksWithSpeaker) {
      throwValidationError('Cannot delete speaker: speaker has associated talks');
    }

    const clipsWithSpeaker = await getOneFrom(ctx.db, 'clips', 'by_speakerId', speakerId);

    if (clipsWithSpeaker) {
      throwValidationError('Cannot delete speaker: speaker has associated clips');
    }

    // Clean up user favorites before deleting speaker
    const favorites = await getManyFrom(ctx.db, 'userFavoriteSpeakers', 'by_speakerId', speakerId);

    await deleteAll(ctx, favorites);

    await ctx.db.delete(speakerId);

    return null;
  },
  returns: v.null(),
});

/**
 * Update an existing speaker.
 */
export const updateSpeaker = mutation({
  args: {
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    firstName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    lastName: v.optional(v.string()),
    ministry: v.optional(v.string()),
    role: v.optional(v.string()),
    speakerId: v.id('speakers'),
    websiteUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const { speakerId, ...rest } = args;
    const updates: Partial<Doc<'speakers'>> = rest;

    const speaker = await getOrThrow(ctx, 'speakers', speakerId);

    // Regenerate slug if name changed to ensure URL consistency
    if (updates.firstName !== undefined || updates.lastName !== undefined) {
      const firstName = updates.firstName ?? speaker.firstName;
      const lastName = updates.lastName ?? speaker.lastName;

      if (!firstName.trim()) {
        throwValidationError('First name cannot be empty', 'firstName');
      }

      if (!lastName.trim()) {
        throwValidationError('Last name cannot be empty', 'lastName');
      }

      const newSlug = slugify(`${firstName} ${lastName}`);

      if (newSlug !== speaker.slug) {
        if (await slugExists(ctx, 'speakers', newSlug, speakerId)) {
          throwDuplicateSlug('Speaker with this name already exists', 'firstName');
        }

        updates.slug = newSlug;
      }
    }

    updates.updatedAt = Date.now();

    await ctx.db.patch(speakerId, updates);

    return speakerId;
  },
  returns: v.id('speakers'),
});
