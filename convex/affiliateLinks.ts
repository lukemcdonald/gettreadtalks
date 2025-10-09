import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { affiliateLinkFields, mutations, queries, validators } from './model/affiliateLinks';

// ============================================
// QUERIES
// ============================================

export const get = query({
  args: validators.getAffiliateLinkArgs,
  handler: async (ctx, args) => {
    return await queries.getAffiliateLink(ctx, args);
  },
  returns: v.union(v.object(affiliateLinkFields), v.null()),
});

export const getByAffiliate = query({
  args: validators.getAffiliateLinksByAffiliateArgs,
  handler: async (ctx, args) => {
    return await queries.getAffiliateLinksByAffiliate(ctx, args);
  },
  returns: v.array(v.object(affiliateLinkFields)),
});

export const getBySlug = query({
  args: validators.getAffiliateLinkBySlugArgs,
  handler: async (ctx, args) => {
    return await queries.getAffiliateLinkBySlug(ctx, args);
  },
  returns: v.union(v.object(affiliateLinkFields), v.null()),
});

export const getByType = query({
  args: validators.getAffiliateLinksByTypeArgs,
  handler: async (ctx, args) => {
    return await queries.getAffiliateLinksByType(ctx, args);
  },
  returns: v.array(v.object(affiliateLinkFields)),
});

export const list = query({
  args: validators.listAffiliateLinksArgs,
  handler: async (ctx, args) => {
    return await queries.getAffiliateLinks(ctx, args);
  },
  returns: v.array(v.object(affiliateLinkFields)),
});

// ============================================
// MUTATIONS
// ============================================

export const create = mutation({
  args: validators.createAffiliateLinkArgs,
  handler: async (ctx, args) => {
    return await mutations.createAffiliateLink(ctx, args);
  },
  returns: v.id('affiliateLinks'),
});

export const update = mutation({
  args: validators.updateAffiliateLinkArgs,
  handler: async (ctx, args) => {
    return await mutations.updateAffiliateLink(ctx, args);
  },
  returns: v.id('affiliateLinks'),
});
