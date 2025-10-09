import { mutation, query } from './_generated/server';
import { mutations, queries, validators } from './model/affiliateLinks';

// ============================================
// QUERIES
// ============================================

export const get = query({
  args: validators.getAffiliateLinkArgs,
  handler: async (ctx, args) => {
    return await queries.getAffiliateLink(ctx, args);
  },
  returns: validators.getAffiliateLinkReturns,
});

export const getByAffiliate = query({
  args: validators.getAffiliateLinksByAffiliateArgs,
  handler: async (ctx, args) => {
    return await queries.getAffiliateLinksByAffiliate(ctx, args);
  },
  returns: validators.getAffiliateLinksByAffiliateReturns,
});

export const getBySlug = query({
  args: validators.getAffiliateLinkBySlugArgs,
  handler: async (ctx, args) => {
    return await queries.getAffiliateLinkBySlug(ctx, args);
  },
  returns: validators.getAffiliateLinkBySlugReturns,
});

export const getByType = query({
  args: validators.getAffiliateLinksByTypeArgs,
  handler: async (ctx, args) => {
    return await queries.getAffiliateLinksByType(ctx, args);
  },
  returns: validators.getAffiliateLinksByTypeReturns,
});

export const list = query({
  args: validators.listAffiliateLinksArgs,
  handler: async (ctx, args) => {
    return await queries.getAffiliateLinks(ctx, args);
  },
  returns: validators.listAffiliateLinksReturns,
});

// ============================================
// MUTATIONS
// ============================================

export const create = mutation({
  args: validators.createAffiliateLinkArgs,
  handler: async (ctx, args) => {
    return await mutations.createAffiliateLink(ctx, args);
  },
  returns: validators.createAffiliateLinkReturns,
});

export const update = mutation({
  args: validators.updateAffiliateLinkArgs,
  handler: async (ctx, args) => {
    return await mutations.updateAffiliateLink(ctx, args);
  },
  returns: validators.updateAffiliateLinkReturns,
});
