import type { Doc } from '../../_generated/dataModel';

import { v } from 'convex/values';
import { getManyFrom, getOneFrom } from 'convex-helpers/server/relationships';

import { internalMutation, mutation } from '../../_generated/server';
import { throwDuplicateSlug, throwNotFound, throwValidationError } from '../../lib/errors';
import { slugExists, slugify } from '../../lib/utils';
import { requireAuth } from '../auth/utils';

/**
 * Create a new speaker.
 *
 * @param ctx - Database context
 * @param args - Speaker creation arguments
 * @returns The ID of the created speaker
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

    // Validate input early
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
 *
 * @param ctx - Database context
 * @param args - Destroy arguments
 * @returns null
 */
export const destroySpeaker = mutation({
  args: {
    id: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const speaker = await ctx.db.get(args.id);

    if (!speaker) {
      throwNotFound('Speaker not found', { resource: 'speaker', resourceId: args.id });
    }

    // Check if speaker is referenced by any talks
    const talksWithSpeaker = await getOneFrom(
      ctx.db,
      'talks',
      'by_speakerId_and_status',
      args.id,
      'speakerId',
    );

    if (talksWithSpeaker) {
      throwValidationError('Cannot delete speaker: speaker has associated talks');
    }

    // Check if speaker is referenced by any clips
    const clipsWithSpeaker = await getOneFrom(ctx.db, 'clips', 'by_speakerId', args.id);

    if (clipsWithSpeaker) {
      throwValidationError('Cannot delete speaker: speaker has associated clips');
    }

    // Delete user favorites for this speaker
    const favorites = await getManyFrom(ctx.db, 'userFavoriteSpeakers', 'by_speakerId', args.id);

    for (const favorite of favorites) {
      await ctx.db.delete(favorite._id);
    }

    // Hard delete the speaker
    await ctx.db.delete(args.id);

    return null;
  },
  returns: v.null(),
});

/**
 * Update an existing speaker.
 *
 * @param ctx - Database context
 * @param args - Update arguments
 * @returns The ID of the updated speaker
 */
export const updateSpeaker = mutation({
  args: {
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    firstName: v.optional(v.string()),
    id: v.id('speakers'),
    imageUrl: v.optional(v.string()),
    lastName: v.optional(v.string()),
    ministry: v.optional(v.string()),
    role: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const { id, ...rest } = args;
    const updates: Partial<Doc<'speakers'>> = rest;

    const speaker = await ctx.db.get(id);

    if (!speaker) {
      throwNotFound('Speaker not found', { resource: 'speaker', resourceId: id });
    }

    // If name changed, update slug
    if (updates.firstName !== undefined || updates.lastName !== undefined) {
      const firstName = updates.firstName ?? speaker.firstName;
      const lastName = updates.lastName ?? speaker.lastName;

      // Validate input early
      if (!firstName.trim()) {
        throwValidationError('First name cannot be empty', 'firstName');
      }

      if (!lastName.trim()) {
        throwValidationError('Last name cannot be empty', 'lastName');
      }

      const newSlug = slugify(`${firstName} ${lastName}`);

      if (newSlug !== speaker.slug) {
        if (await slugExists(ctx, 'speakers', newSlug, id)) {
          throwDuplicateSlug('Speaker with this name already exists', 'firstName');
        }

        updates.slug = newSlug;
      }
    }

    updates.updatedAt = Date.now();

    await ctx.db.patch(id, updates);

    return id;
  },
  returns: v.id('speakers'),
});

/**
 * Internal batch update for speaker image URLs.
 * Used for admin tasks like migrating images.
 *
 * @param ctx - Database context
 * @param args - Array of updates
 * @returns Count of updated speakers
 */
export const batchUpdateSpeakerImages = internalMutation({
  args: {
    updates: v.array(
      v.object({
        imageUrl: v.string(),
        slug: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    let updated = 0;

    for (const update of args.updates) {
      const speaker = await ctx.db
        .query('speakers')
        .withIndex('by_slug', (q) => q.eq('slug', update.slug))
        .first();

      if (speaker) {
        await ctx.db.patch(speaker._id, {
          imageUrl: update.imageUrl,
          updatedAt: Date.now(),
        });
        updated += 1;
      }
    }

    return updated;
  },
  returns: v.number(),
});
