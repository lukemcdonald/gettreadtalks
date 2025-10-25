import type { Doc } from '../../_generated/dataModel';

import { v } from 'convex/values';

import { mutation } from '../../_generated/server';
import { normalizeSlug, slugExists } from '../../lib/utils';
import { requireAuth } from '../auth/utils';
import { affiliateLinkTypes } from './validators';

/**
 * Create a new affiliate link.
 *
 * @param ctx - Database context
 * @param args - Affiliate link creation arguments
 * @returns The ID of the created affiliate link
 */
export const createAffiliateLink = mutation({
  args: {
    affiliate: v.optional(v.string()),
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    title: v.string(),
    type: affiliateLinkTypes,
    url: v.string(),
  },
  handler: async (ctx, args) => {
    // return await mutations.createAffiliateLink(ctx, args);
    await requireAuth(ctx);

    const slug = normalizeSlug(args.title);

    if (await slugExists(ctx, 'affiliateLinks', slug)) {
      throw new Error('Affiliate link with this title already exists');
    }

    return await ctx.db.insert('affiliateLinks', { ...args, slug });
  },
  returns: v.id('affiliateLinks'),
});

/**
 * Destroy an affiliate link (permanently delete from database).
 *
 * @param ctx - Database context
 * @param args - Destroy arguments
 * @returns null
 */
export const destroyAffiliateLink = mutation({
  args: {
    id: v.id('affiliateLinks'),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const affiliateLink = await ctx.db.get(args.id);

    if (!affiliateLink) {
      throw new Error('Affiliate link not found');
    }

    // Hard delete the affiliate link
    await ctx.db.delete(args.id);

    return null;
  },
  returns: v.null(),
});

/**
 * Update an existing affiliate link.
 *
 * @param ctx - Database context
 * @param args - Update arguments
 * @returns The ID of the updated affiliate link
 */
export const updateAffiliateLink = mutation({
  args: {
    affiliate: v.optional(v.string()),
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    id: v.id('affiliateLinks'),
    title: v.optional(v.string()),
    type: v.optional(affiliateLinkTypes),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
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
  },
  returns: v.id('affiliateLinks'),
});
