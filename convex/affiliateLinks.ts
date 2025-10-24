import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { doc, docs } from './lib/validators/schema';
import { mutations, queries } from './model/affiliateLinks';

const affiliateLinkTypes = v.union(
  v.literal('app'),
  v.literal('book'),
  v.literal('movie'),
  v.literal('music'),
  v.literal('podcast'),
);

// ============================================
// QUERIES
// ============================================

export const get = query({
  args: {
    id: v.id('affiliateLinks'),
  },
  handler: async (ctx, args) => {
    return await queries.getAffiliateLink(ctx, args);
  },
  returns: doc('affiliateLinks', true),
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await queries.getAffiliateLinkBySlug(ctx, args);
  },
  returns: doc('affiliateLinks', true),
});

export const list = query({
  args: {
    affiliate: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
    type: v.optional(affiliateLinkTypes),
  },
  handler: async (ctx, args) => {
    return await queries.getAffiliateLinks(ctx, args);
  },
  returns: docs('affiliateLinks'),
});

export const listByAffiliate = query({
  args: {
    affiliate: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await queries.getAffiliateLinksByAffiliate(ctx, args);
  },
  returns: docs('affiliateLinks'),
});

export const listByType = query({
  args: {
    limit: v.optional(v.number()),
    type: affiliateLinkTypes,
  },
  handler: async (ctx, args) => {
    return await queries.getAffiliateLinksByType(ctx, args);
  },
  returns: docs('affiliateLinks'),
});

// ============================================
// MUTATIONS
// ============================================

export const create = mutation({
  args: {
    affiliate: v.optional(v.string()),
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    title: v.string(),
    type: affiliateLinkTypes,
    url: v.string(),
  },
  handler: async (ctx, args) => {
    return await mutations.createAffiliateLink(ctx, args);
  },
  returns: v.id('affiliateLinks'),
});

export const destroy = mutation({
  args: {
    id: v.id('affiliateLinks'),
  },
  handler: async (ctx, args) => {
    return await mutations.destroyAffiliateLink(ctx, args);
  },
  returns: v.null(),
});

export const update = mutation({
  args: {
    affiliate: v.optional(v.string()),
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    id: v.id('affiliateLinks'),
    title: v.optional(v.string()),
    type: v.optional(affiliateLinkTypes),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await mutations.updateAffiliateLink(ctx, args);
  },
  returns: v.id('affiliateLinks'),
});
