import type { QueryCtx } from '../../_generated/server';

import { AffiliateLinkType } from './schema';
import type {
  GetAffiliateLinkArgs,
  GetAffiliateLinkBySlugArgs,
  ListAffiliateLinksArgs,
  ListAffiliateLinksByAffiliateArgs,
  ListAffiliateLinksByTypeArgs,
} from './types';

/**
 * Get affiliate link by ID.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Affiliate link or null if not found
 */
export async function getAffiliateLink(ctx: QueryCtx, args: GetAffiliateLinkArgs) {
  return await ctx.db.get(args.id);
}

/**
 * Get affiliate link by slug.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Affiliate link or null if not found
 */
export async function getAffiliateLinkBySlug(ctx: QueryCtx, args: GetAffiliateLinkBySlugArgs) {
  return await ctx.db
    .query('affiliateLinks')
    .withIndex('by_slug', (q) => q.eq('slug', args.slug))
    .unique();
}

/**
 * Get affiliate links by type.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of affiliate links of the specified type
 */
export async function getAffiliateLinksByType(ctx: QueryCtx, args: ListAffiliateLinksByTypeArgs) {
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
  args: ListAffiliateLinksByAffiliateArgs,
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
export async function getAffiliateLinks(ctx: QueryCtx, args: ListAffiliateLinksArgs) {
  const { affiliate, featured, limit = 50, type } = args;

  // Use index if filtering by featured, otherwise get all links
  const allLinks =
    featured !== undefined
      ? await ctx.db
          .query('affiliateLinks')
          .withIndex('by_featured', (q) => q.eq('featured', featured))
          .collect()
      : await ctx.db.query('affiliateLinks').collect();

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
