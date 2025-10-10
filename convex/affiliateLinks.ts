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

export const getBySlug = query({
  args: validators.getAffiliateLinkBySlugArgs,
  handler: async (ctx, args) => {
    return await queries.getAffiliateLinkBySlug(ctx, args);
  },
  returns: validators.getAffiliateLinkBySlugReturns,
});

export const list = query({
  args: validators.listAffiliateLinksArgs,
  handler: async (ctx, args) => {
    return await queries.getAffiliateLinks(ctx, args);
  },
  returns: validators.listAffiliateLinksReturns,
});

export const listByAffiliate = query({
  args: validators.listAffiliateLinksByAffiliateArgs,
  handler: async (ctx, args) => {
    return await queries.getAffiliateLinksByAffiliate(ctx, args);
  },
  returns: validators.listAffiliateLinksByAffiliateReturns,
});

export const listByType = query({
  args: validators.listAffiliateLinksByTypeArgs,
  handler: async (ctx, args) => {
    return await queries.getAffiliateLinksByType(ctx, args);
  },
  returns: validators.listAffiliateLinksByTypeReturns,
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

export const deleteAffiliateLink = mutation({
  args: validators.deleteAffiliateLinkArgs,
  handler: async (ctx, args) => {
    return await mutations.deleteAffiliateLink(ctx, args);
  },
  returns: validators.deleteAffiliateLinkReturns,
});

export const update = mutation({
  args: validators.updateAffiliateLinkArgs,
  handler: async (ctx, args) => {
    return await mutations.updateAffiliateLink(ctx, args);
  },
  returns: validators.updateAffiliateLinkReturns,
});
