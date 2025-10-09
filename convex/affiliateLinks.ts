import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { createAffiliateLink, updateAffiliateLink } from './model/affiliateLinks/mutations';
import {
  getAffiliateLink,
  getAffiliateLinkBySlug,
  getAffiliateLinks,
  getAffiliateLinksByAffiliate,
  getAffiliateLinksByType,
} from './model/affiliateLinks/queries';
import { affiliateLinkFields } from './model/affiliateLinks/schema';

export const get = query({
  args: {
    id: v.id('affiliateLinks'),
  },
  handler: async (ctx, args) => {
    return await getAffiliateLink(ctx, args.id);
  },
  returns: v.union(v.object(affiliateLinkFields), v.null()),
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await getAffiliateLinkBySlug(ctx, args.slug);
  },
  returns: v.union(v.object(affiliateLinkFields), v.null()),
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
  handler: async (ctx, args) => {
    const { limit = 20, type } = args;
    return await getAffiliateLinksByType(ctx, type, limit);
  },
  returns: v.array(v.object(affiliateLinkFields)),
});

export const getByAffiliate = query({
  args: {
    affiliate: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { affiliate, limit = 20 } = args;
    return await getAffiliateLinksByAffiliate(ctx, affiliate, limit);
  },
  returns: v.array(v.object(affiliateLinkFields)),
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
  handler: async (ctx, args) => {
    return await getAffiliateLinks(ctx, args);
  },
  returns: v.array(v.object(affiliateLinkFields)),
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
  handler: async (ctx, args) => {
    return await createAffiliateLink(ctx, args);
  },
  returns: v.id('affiliateLinks'),
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
  handler: async (ctx, args) => {
    return await updateAffiliateLink(ctx, args);
  },
  returns: v.id('affiliateLinks'),
});
