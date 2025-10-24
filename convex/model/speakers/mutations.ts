import type { Doc, Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';

import { getManyFrom, getOneFrom } from 'convex-helpers/server/relationships';

import { throwDuplicateSlug, throwNotFound, throwValidationError } from '../../lib/errors';
import { normalizeSlug, slugExists } from '../../lib/utils';
import { requireAuth } from '../auth/queries';

/**
 * Create a new speaker.
 *
 * @param ctx - Database context
 * @param args - Speaker creation arguments
 * @returns The ID of the created speaker
 */
export async function createSpeaker(
  ctx: MutationCtx,
  args: {
    description?: string;
    firstName: string;
    imageUrl?: string;
    lastName: string;
    ministry?: string;
    role?: string;
    websiteUrl?: string;
  },
) {
  await requireAuth(ctx);

  const slug = normalizeSlug(`${args.firstName} ${args.lastName}`);

  if (await slugExists(ctx, 'speakers', slug)) {
    throwDuplicateSlug('Speaker with this name already exists', 'firstName');
  }

  return await ctx.db.insert('speakers', {
    ...args,
    slug,
  });
}

/**
 * Update an existing speaker.
 *
 * @param ctx - Database context
 * @param args - Update arguments
 * @returns The ID of the updated speaker
 */
export async function updateSpeaker(
  ctx: MutationCtx,
  args: {
    description?: string;
    featured?: boolean;
    firstName?: string;
    id: Id<'speakers'>;
    imageUrl?: string;
    lastName?: string;
    ministry?: string;
    role?: string;
    websiteUrl?: string;
  },
) {
  await requireAuth(ctx);

  const { id, ...rest } = args;
  const updates: Partial<Doc<'speakers'>> = rest;

  const speaker = await ctx.db.get(id);

  if (!speaker) {
    throwNotFound('Speaker not found', { resource: 'speaker', resourceId: id });
  }

  // If name changed, update slug
  if (updates.firstName || updates.lastName) {
    const firstName = updates.firstName || speaker.firstName;
    const lastName = updates.lastName || speaker.lastName;
    const newSlug = normalizeSlug(`${firstName} ${lastName}`);

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
}

/**
 * Destroy a speaker (permanently delete from database with reference checks).
 *
 * @param ctx - Database context
 * @param args - Destroy arguments
 * @returns null
 */
export async function destroySpeaker(
  ctx: MutationCtx,
  args: {
    id: Id<'speakers'>;
  },
) {
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
}
