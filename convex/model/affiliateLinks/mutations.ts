import type { Doc } from '../../_generated/dataModel';

import { v } from 'convex/values';

import { mutation } from '../../_generated/server';
import { throwDuplicateSlug, throwNotFound, throwValidationError } from '../../lib/errors';
import { slugExists, slugify } from '../../lib/utils';
import { requireAuth } from '../auth/utils';
import { affiliateLinkTypes } from './validators';

/**
 * Create a new affiliate link.
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
 */
export const destroyAffiliateLink = mutation({
  args: {
    affiliateLinkId: v.id('affiliateLinks'),
  },
  handler: async (ctx, args) => {
    const { affiliateLinkId } = args;

    await requireAuth(ctx);

    const affiliateLink = await ctx.db.get('affiliateLinks', affiliateLinkId);

    if (!affiliateLink) {
      throwNotFound('Affiliate link not found', {
        resource: 'affiliateLink',
        resourceId: affiliateLinkId,
      });
    }

    await ctx.db.delete(affiliateLinkId);

    return null;
  },
  returns: v.null(),
});

/**
 * Update an existing affiliate link.
 */
export const updateAffiliateLink = mutation({
  args: {
    affiliate: v.optional(v.string()),
    affiliateLinkId: v.id('affiliateLinks'),
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    title: v.optional(v.string()),
    type: v.optional(affiliateLinkTypes),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { affiliateLinkId, ...rest } = args;

    await requireAuth(ctx);

    const updates: Partial<Doc<'affiliateLinks'>> = rest;

    const affiliateLink = await ctx.db.get('affiliateLinks', affiliateLinkId);

    if (!affiliateLink) {
      throwNotFound('Affiliate link not found', {
        resource: 'affiliateLink',
        resourceId: affiliateLinkId,
      });
    }

    // If title changed, update slug
    if (updates.title !== undefined) {
      // Validate input early
      if (!updates.title.trim()) {
        throwValidationError('Title cannot be empty', 'title');
      }

      const newSlug = slugify(updates.title);

      if (newSlug !== affiliateLink.slug) {
        if (await slugExists(ctx, 'affiliateLinks', newSlug, affiliateLinkId)) {
          throwDuplicateSlug('Affiliate link with this title already exists', 'title');
        }

        updates.slug = newSlug;
      }
    }

    updates.updatedAt = Date.now();

    await ctx.db.patch(affiliateLinkId, updates);

    return affiliateLinkId;
  },
  returns: v.id('affiliateLinks'),
});
