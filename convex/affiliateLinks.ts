import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { affiliateLinkFields } from './model/affiliateLinks/schema';
import {
  getAffiliateLinkBySlug,
  getAffiliateLinks,
  getAffiliateLinksByAffiliate,
  getAffiliateLinksByType,
  getFeaturedAffiliateLinks,
} from './model/affiliateLinks/queries';
import { createAffiliateLink, updateAffiliateLink } from './model/affiliateLinks/mutations';

// Query Functions

export const getFeatured = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object(affiliateLinkFields)),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await getFeaturedAffiliateLinks(ctx, limit);
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(v.object(affiliateLinkFields), v.null()),
  handler: async (ctx, args) => {
    const { slug } = args;
    return await getAffiliateLinkBySlug(ctx, slug);
  },
});

export const getByType = query({
  args: {
    limit: v.optional(v.number()),
    type: v.union(
      v.literal('app'),
      v.literal('book'),
      v.literal('movie'),
      v.literal('music'),
      v.literal('podcast'),
    ),
  },
  returns: v.array(v.object(affiliateLinkFields)),
  handler: async (ctx, args) => {
    const { limit = 20, type } = args;
    return await getAffiliateLinksByType(ctx, type, limit);
  },
});

export const getByAffiliate = query({
  args: {
    affiliate: v.string(),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object(affiliateLinkFields)),
  handler: async (ctx, args) => {
    const { affiliate, limit = 20 } = args;
    return await getAffiliateLinksByAffiliate(ctx, affiliate, limit);
  },
});

export const list = query({
  args: {
    affiliate: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
    type: v.optional(
      v.union(
        v.literal('app'),
        v.literal('book'),
        v.literal('movie'),
        v.literal('music'),
        v.literal('podcast'),
      ),
    ),
  },
  returns: v.array(v.object(affiliateLinkFields)),
  handler: async (ctx, args) => {
    return await getAffiliateLinks(ctx, args);
  },
});

// Mutation Functions

export const create = mutation({
  args: {
    affiliate: v.optional(v.string()),
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    title: v.string(),
    type: v.union(
      v.literal('app'),
      v.literal('book'),
      v.literal('movie'),
      v.literal('music'),
      v.literal('podcast'),
    ),
    url: v.string(),
  },
  returns: v.id('affiliateLinks'),
  handler: async (ctx, args) => {
    return await createAffiliateLink(ctx, args);
  },
});

export const update = mutation({
  args: {
    affiliate: v.optional(v.string()),
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    id: v.id('affiliateLinks'),
    title: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal('app'),
        v.literal('book'),
        v.literal('movie'),
        v.literal('music'),
        v.literal('podcast'),
      ),
    ),
    url: v.optional(v.string()),
  },
  returns: v.id('affiliateLinks'),
  handler: async (ctx, args) => {
    return await updateAffiliateLink(ctx, args);
  },
});
