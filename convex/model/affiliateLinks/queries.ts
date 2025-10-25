import { v } from 'convex/values';
import { getOneFrom } from 'convex-helpers/server/relationships';

import { query } from '../../_generated/server';
import { doc, docs } from '../../lib/validators/schema';
import { affiliateLinkTypes } from './validators';

/**
 * Get affiliate link by ID.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Affiliate link or null if not found
 */
export const getAffiliateLink = query({
  args: {
    id: v.id('affiliateLinks'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
  returns: doc('affiliateLinks', true),
});

/**
 * Get affiliate link by slug.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Affiliate link or null if not found
 */
export const getAffiliateLinkBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await getOneFrom(ctx.db, 'affiliateLinks', 'by_slug', args.slug);
  },
  returns: doc('affiliateLinks', true),
});

/**
 * List all affiliate links with optional filters.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of affiliate links
 */
export const listAffiliateLinks = query({
  args: {
    affiliate: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
    type: v.optional(affiliateLinkTypes),
  },
  handler: async (ctx, args) => {
    const { affiliate, featured, limit = 50, type } = args;

    // Use index if filtering by featured, otherwise get all links
    // Limited to 100 to prevent memory issues in admin UI
    const allLinks =
      featured !== undefined
        ? await ctx.db
            .query('affiliateLinks')
            .withIndex('by_featured', (q) => q.eq('featured', featured))
            .take(100)
        : await ctx.db.query('affiliateLinks').take(100);

    // Apply additional filters
    let filteredLinks = allLinks;

    if (type) {
      filteredLinks = filteredLinks.filter((link) => link.type === type);
    }

    if (affiliate) {
      filteredLinks = filteredLinks.filter((link) => link.affiliate === affiliate);
    }

    // Sort by creation time (newest first) and limit
    return filteredLinks
      .sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0))
      .slice(0, limit);
  },
  returns: docs('affiliateLinks'),
});

/**
 * List affiliate links by affiliate.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of affiliate links from the specified affiliate
 */
export const listAffiliateLinksByAffiliate = query({
  args: {
    affiliate: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { affiliate, limit = 20 } = args;

    return await ctx.db
      .query('affiliateLinks')
      .withIndex('by_affiliate', (q) => q.eq('affiliate', affiliate))
      .order('desc')
      .take(limit);
  },
  returns: docs('affiliateLinks'),
});

/**
 * List affiliate links by type.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of affiliate links of the specified type
 */
export const listAffiliateLinksByType = query({
  args: {
    limit: v.optional(v.number()),
    type: affiliateLinkTypes,
  },
  handler: async (ctx, args) => {
    const { limit = 20, type } = args;

    return await ctx.db
      .query('affiliateLinks')
      .withIndex('by_type', (q) => q.eq('type', type))
      .order('desc')
      .take(limit);
  },
  returns: docs('affiliateLinks'),
});
