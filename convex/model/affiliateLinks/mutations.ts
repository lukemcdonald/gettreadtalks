import type { Doc } from '../../_generated/dataModel';

import { v } from 'convex/values';

import { mutation } from '../../_generated/server';
import { throwDuplicateSlug, throwNotFound, throwValidationError } from '../../lib/errors';
import { slugExists, slugify } from '../../lib/utils';
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

    // Validate input early
    if (!args.title.trim()) {
      throwValidationError('Title cannot be empty', 'title');
    }

    const slug = slugify(args.title);

    if (await slugExists(ctx, 'affiliateLinks', slug)) {
      throwDuplicateSlug('Affiliate link with this title already exists', 'title');
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

    const affiliateLink = await ctx.db.get('affiliateLinks', args.id);

    if (!affiliateLink) {
      throwNotFound('Affiliate link not found', { resource: 'affiliateLink', resourceId: args.id });
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

    const affiliateLink = await ctx.db.get('affiliateLinks', id);

    if (!affiliateLink) {
      throwNotFound('Affiliate link not found', { resource: 'affiliateLink', resourceId: id });
    }

    // If title changed, update slug
    if (updates.title !== undefined) {
      // Validate input early
      if (!updates.title.trim()) {
        throwValidationError('Title cannot be empty', 'title');
      }

      const newSlug = slugify(updates.title);

      if (newSlug !== affiliateLink.slug) {
        if (await slugExists(ctx, 'affiliateLinks', newSlug, id)) {
          throwDuplicateSlug('Affiliate link with this title already exists', 'title');
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
