import type { Doc } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';
import type {
  CreateAffiliateLinkArgs,
  DestroyAffiliateLinkArgs,
  UpdateAffiliateLinkArgs,
} from './types';

import { normalizeSlug, slugExists } from '../../lib/utils';
import { requireAuth } from '../auth/queries';

/**
 * Create a new affiliate link.
 *
 * @param ctx - Database context
 * @param args - Affiliate link creation arguments
 * @returns The ID of the created affiliate link
 */
export async function createAffiliateLink(ctx: MutationCtx, args: CreateAffiliateLinkArgs) {
  await requireAuth(ctx);

  const slug = normalizeSlug(args.title);

  if (await slugExists(ctx, 'affiliateLinks', slug)) {
    throw new Error('Affiliate link with this title already exists');
  }

  return await ctx.db.insert('affiliateLinks', {
    ...args,
    slug,
  });
}

/**
 * Update an existing affiliate link.
 *
 * @param ctx - Database context
 * @param args - Update arguments
 * @returns The ID of the updated affiliate link
 */
export async function updateAffiliateLink(ctx: MutationCtx, args: UpdateAffiliateLinkArgs) {
  await requireAuth(ctx);

  const { id, ...rest } = args;
  const updates: Partial<Doc<'affiliateLinks'>> = rest;

  const affiliateLink = await ctx.db.get(id);

  if (!affiliateLink) {
    throw new Error('Affiliate link not found');
  }

  // If title changed, update slug
  if (updates.title) {
    const newSlug = normalizeSlug(updates.title);

    if (newSlug !== affiliateLink.slug) {
      if (await slugExists(ctx, 'affiliateLinks', newSlug, id)) {
        throw new Error('Affiliate link with this title already exists');
      }

      updates.slug = newSlug;
    }
  }

  updates.updatedAt = Date.now();

  await ctx.db.patch(id, updates);

  return id;
}

/**
 * Destroy an affiliate link (permanently delete from database).
 *
 * @param ctx - Database context
 * @param args - Destroy arguments
 * @returns null
 */
export async function destroyAffiliateLink(ctx: MutationCtx, args: DestroyAffiliateLinkArgs) {
  await requireAuth(ctx);

  const affiliateLink = await ctx.db.get(args.id);

  if (!affiliateLink) {
    throw new Error('Affiliate link not found');
  }

  // Hard delete the affiliate link
  await ctx.db.delete(args.id);

  return null;
}
