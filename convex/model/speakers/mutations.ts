import type { MutationCtx } from '../../_generated/server';
import type { ObjectType } from 'convex/values';

import { Doc, Id } from '../../_generated/dataModel';
import { normalizeSlug, slugExists } from '../../lib/utils';
import { requireAuth } from '../auth/queries';
import { createSpeakerArgs, updateSpeakerArgs } from './validators';

/**
 * Create a new speaker.
 *
 * @param ctx - Database context
 * @param args - Speaker creation arguments
 * @returns The ID of the created speaker
 */
export async function createSpeaker(ctx: MutationCtx, args: ObjectType<typeof createSpeakerArgs>) {
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
export async function updateSpeaker(ctx: MutationCtx, args: ObjectType<typeof updateSpeakerArgs>) {
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
