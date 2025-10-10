import type { MutationCtx } from '../../_generated/server';

import { Doc } from '../../_generated/dataModel';
import { normalizeSlug, slugExists } from '../../lib/utils';
import { requireAuth } from '../auth/queries';
import type { CreateSpeakerArgs, DestroySpeakerArgs, UpdateSpeakerArgs } from './types';

/**
 * Create a new speaker.
 *
 * @param ctx - Database context
 * @param args - Speaker creation arguments
 * @returns The ID of the created speaker
 */
export async function createSpeaker(ctx: MutationCtx, args: CreateSpeakerArgs) {
  await requireAuth(ctx);

  const slug = normalizeSlug(`${args.firstName} ${args.lastName}`);

  if (await slugExists(ctx, 'speakers', slug)) {
    throw new Error('Speaker with this name already exists');
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
export async function updateSpeaker(ctx: MutationCtx, args: UpdateSpeakerArgs) {
  await requireAuth(ctx);

  const { id, ...rest } = args;
  const updates: Partial<Doc<'speakers'>> = rest;

  const speaker = await ctx.db.get(id);

  if (!speaker) {
    throw new Error('Speaker not found');
  }

  // If name changed, update slug
  if (updates.firstName || updates.lastName) {
    const firstName = updates.firstName || speaker.firstName;
    const lastName = updates.lastName || speaker.lastName;
    const newSlug = normalizeSlug(`${firstName} ${lastName}`);

    if (newSlug !== speaker.slug) {
      if (await slugExists(ctx, 'speakers', newSlug, id)) {
        throw new Error('Speaker with this name already exists');
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
export async function destroySpeaker(ctx: MutationCtx, args: DestroySpeakerArgs) {
  await requireAuth(ctx);

  const speaker = await ctx.db.get(args.id);

  if (!speaker) {
    throw new Error('Speaker not found');
  }

  // Check if speaker is referenced by any talks
  const talksWithSpeaker = await ctx.db
    .query('talks')
    .withIndex('by_speaker_id_and_status', (q) => q.eq('speakerId', args.id))
    .first();

  if (talksWithSpeaker) {
    throw new Error('Cannot delete speaker: speaker has associated talks');
  }

  // Check if speaker is referenced by any clips
  const clipsWithSpeaker = await ctx.db
    .query('clips')
    .withIndex('by_speaker_id', (q) => q.eq('speakerId', args.id))
    .first();

  if (clipsWithSpeaker) {
    throw new Error('Cannot delete speaker: speaker has associated clips');
  }

  // Delete user favorites for this speaker
  const favorites = await ctx.db
    .query('userFavoriteSpeakers')
    .withIndex('by_speaker_id', (q) => q.eq('speakerId', args.id))
    .collect();

  for (const favorite of favorites) {
    await ctx.db.delete(favorite._id);
  }

  // Hard delete the speaker
  await ctx.db.delete(args.id);

  return null;
}
