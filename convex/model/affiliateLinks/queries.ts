import type { Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';

import { getOneFrom } from 'convex-helpers/server/relationships';

/**
 * Get affiliate link by ID.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Affiliate link or null if not found
 */
export async function getAffiliateLink(ctx: QueryCtx, args: { id: Id<'affiliateLinks'> }) {
  return await ctx.db.get(args.id);
}

/**
 * Get affiliate link by slug.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Affiliate link or null if not found
 */
export async function getAffiliateLinkBySlug(ctx: QueryCtx, args: { slug: string }) {
  return await getOneFrom(ctx.db, 'affiliateLinks', 'by_slug', args.slug);
}

/**
 * Get affiliate links by type.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of affiliate links of the specified type
 */
export async function getAffiliateLinksByType(
  ctx: QueryCtx,
  args: { limit?: number; type: 'app' | 'book' | 'movie' | 'music' | 'podcast' },
) {
  const { limit = 20, type } = args;

  return await ctx.db
    .query('affiliateLinks')
    .withIndex('by_type', (q) => q.eq('type', type))
    .order('desc')
    .take(limit);
}

/**
 * Get affiliate links by affiliate.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of affiliate links from the specified affiliate
 */
export async function getAffiliateLinksByAffiliate(
  ctx: QueryCtx,
  args: { affiliate: string; limit?: number },
) {
  const { affiliate, limit = 20 } = args;

  return await ctx.db
    .query('affiliateLinks')
    .withIndex('by_affiliate', (q) => q.eq('affiliate', affiliate))
    .order('desc')
    .take(limit);
}

/**
 * Get all affiliate links with optional filters.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of affiliate links
 */
export async function getAffiliateLinks(
  ctx: QueryCtx,
  args: {
    affiliate?: string;
    featured?: boolean;
    limit?: number;
    type?: 'app' | 'book' | 'movie' | 'music' | 'podcast';
  },
) {
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
}
