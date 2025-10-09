import { v } from 'convex/values';

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

export const updateAffiliateLinkArgs = {
  affiliate: v.optional(v.string()),
  description: v.optional(v.string()),
  featured: v.optional(v.boolean()),
  id: v.id('affiliateLinks'),
  title: v.optional(v.string()),
  type: v.optional(affiliateLinkTypes),
  url: v.optional(v.string()),
};
