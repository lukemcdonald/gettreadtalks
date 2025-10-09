import type { Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { ObjectType } from 'convex/values';

import { AffiliateLinkType } from './schema';
import {
  getAffiliateLinkArgs,
  getAffiliateLinkBySlugArgs,
  getAffiliateLinksByAffiliateArgs,
  getAffiliateLinksByTypeArgs,
  listAffiliateLinksArgs,
} from './validators';

/**
 * Get affiliate link by ID.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Affiliate link or null if not found
 */
export async function getAffiliateLink(
  ctx: QueryCtx,
  args: ObjectType<typeof getAffiliateLinkArgs>,
) {
  return await ctx.db.get(args.id);
}

/**
 * Get affiliate link by slug.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns Affiliate link or null if not found
 */
export async function getAffiliateLinkBySlug(
  ctx: QueryCtx,
  args: ObjectType<typeof getAffiliateLinkBySlugArgs>,
) {
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
export async function getAffiliateLinksByType(
  ctx: QueryCtx,
  args: ObjectType<typeof getAffiliateLinksByTypeArgs>,
) {
  const { limit = 20, type } = args;

  const allLinks = await ctx.db.query('affiliateLinks').collect();

  // Filter by type since there's no index for type
  const filteredLinks = allLinks
    .filter((link) => link.type === type)
    .sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0))
    .slice(0, limit);

  return filteredLinks;
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
  args: ObjectType<typeof getAffiliateLinksByAffiliateArgs>,
) {
  const { affiliate, limit = 20 } = args;

  const allLinks = await ctx.db.query('affiliateLinks').collect();

  // Filter by affiliate since there's no index for affiliate
  const filteredLinks = allLinks
    .filter((link) => link.affiliate === affiliate)
    .sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0))
    .slice(0, limit);

  return filteredLinks;
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
  args: ObjectType<typeof listAffiliateLinksArgs>,
) {
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
