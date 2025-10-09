import { v } from 'convex/values';

import { affiliateLinkFields } from './schema';

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

export const getAffiliateLinkArgs = {
  id: v.id('affiliateLinks'),
};

export const getAffiliateLinkReturns = v.union(v.object(affiliateLinkFields), v.null());

export const getAffiliateLinkBySlugArgs = {
  slug: v.string(),
};

export const getAffiliateLinkBySlugReturns = v.union(v.object(affiliateLinkFields), v.null());

export const getAffiliateLinksByAffiliateArgs = {
  affiliate: v.string(),
  limit: v.optional(v.number()),
};

export const getAffiliateLinksByAffiliateReturns = v.array(v.object(affiliateLinkFields));

export const getAffiliateLinksByTypeArgs = {
  limit: v.optional(v.number()),
  type: affiliateLinkTypes,
};

export const getAffiliateLinksByTypeReturns = v.array(v.object(affiliateLinkFields));

export const listAffiliateLinksArgs = {
  affiliate: v.optional(v.string()),
  featured: v.optional(v.boolean()),
  limit: v.optional(v.number()),
  type: v.optional(affiliateLinkTypes),
};

export const listAffiliateLinksReturns = v.array(v.object(affiliateLinkFields));

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
