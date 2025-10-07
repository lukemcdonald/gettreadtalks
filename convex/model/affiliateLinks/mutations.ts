import { Doc, Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';
import { normalizeSlug } from '../../utils';
import { requireAuth } from '../auth/queries';
import { AffiliateLinkType } from './schema';

/**
 * Create a new affiliate link.
 *
 * @param ctx - Database context
 * @param args - Affiliate link creation arguments
 * @returns The ID of the created affiliate link
 */
export async function createAffiliateLink(
  ctx: MutationCtx,
  args: {
    affiliate?: string;
    description?: string;
    featured?: boolean;
    title: string;
    type: AffiliateLinkType;
    url: string;
  },
) {
  await requireAuth(ctx);

  const slug = normalizeSlug(args.title);

  const existing = await ctx.db
    .query('affiliateLinks')
    .withIndex('by_slug', (q) => q.eq('slug', slug))
    .first();

  if (existing) {
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
export async function updateAffiliateLink(
  ctx: MutationCtx,
  args: {
    affiliate?: string;
    description?: string;
    featured?: boolean;
    id: Id<'affiliateLinks'>;
    title?: string;
    type?: AffiliateLinkType;
    url?: string;
  },
) {
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
      const existing = await ctx.db
        .query('affiliateLinks')
        .withIndex('by_slug', (q) => q.eq('slug', newSlug))
        .first();

      if (existing && existing._id !== id) {
        throw new Error('Affiliate link with this title already exists');
      }

      updates.slug = newSlug;
    }
  }

  updates.updatedAt = Date.now();

  await ctx.db.patch(id, updates);

  return id;
}
