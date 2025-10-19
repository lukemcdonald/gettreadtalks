import { v } from 'convex/values';

import { doc, docs } from '../../lib/validators/schema';

const affiliateLinkTypes = v.union(
  v.literal('app'),
  v.literal('book'),
  v.literal('movie'),
  v.literal('music'),
  v.literal('podcast'),
);

export const createAffiliateLinkArgs = {
  affiliate: v.optional(v.string()),
  description: v.optional(v.string()),
  featured: v.optional(v.boolean()),
  title: v.string(),
  type: affiliateLinkTypes,
  url: v.string(),
};

export const createAffiliateLinkReturns = v.id('affiliateLinks');

export const destroyAffiliateLinkArgs = {
  id: v.id('affiliateLinks'),
};

export const destroyAffiliateLinkReturns = v.null();

export const getAffiliateLinkArgs = {
  id: v.id('affiliateLinks'),
};

export const getAffiliateLinkReturns = doc('affiliateLinks', true);

export const getAffiliateLinkBySlugArgs = {
  slug: v.string(),
};

export const getAffiliateLinkBySlugReturns = doc('affiliateLinks', true);

export const listAffiliateLinksArgs = {
  affiliate: v.optional(v.string()),
  featured: v.optional(v.boolean()),
  limit: v.optional(v.number()),
  type: v.optional(affiliateLinkTypes),
};

export const listAffiliateLinksReturns = docs('affiliateLinks');

export const listAffiliateLinksByAffiliateArgs = {
  affiliate: v.string(),
  limit: v.optional(v.number()),
};

export const listAffiliateLinksByAffiliateReturns = docs('affiliateLinks');

export const listAffiliateLinksByTypeArgs = {
  limit: v.optional(v.number()),
  type: affiliateLinkTypes,
};

export const listAffiliateLinksByTypeReturns = docs('affiliateLinks');

export const updateAffiliateLinkArgs = {
  affiliate: v.optional(v.string()),
  description: v.optional(v.string()),
  featured: v.optional(v.boolean()),
  id: v.id('affiliateLinks'),
  title: v.optional(v.string()),
  type: v.optional(affiliateLinkTypes),
  url: v.optional(v.string()),
};

export const updateAffiliateLinkReturns = v.id('affiliateLinks');
