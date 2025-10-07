import { Doc, Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';
import { normalizeSlug } from '../../utils';
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

  const existing = await ctx.db
    .query('speakers')
    .withIndex('by_slug', (q) => q.eq('slug', slug))
    .first();

  if (existing) {
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
export async function updateSpeaker(
  ctx: MutationCtx,
  args: {
    description?: string;
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
    throw new Error('Speaker not found');
  }

  // If name changed, update slug
  if (updates.firstName || updates.lastName) {
    const firstName = updates.firstName || speaker.firstName;
    const lastName = updates.lastName || speaker.lastName;
    const newSlug = normalizeSlug(`${firstName} ${lastName}`);

    if (newSlug !== speaker.slug) {
      const existing = await ctx.db
        .query('speakers')
        .withIndex('by_slug', (q) => q.eq('slug', newSlug))
        .first();

      if (existing && existing._id !== id) {
        throw new Error('Speaker with this name already exists');
      }

      updates.slug = newSlug;
    }
  }

  updates.updatedAt = Date.now();

  await ctx.db.patch(id, updates);

  return id;
}
