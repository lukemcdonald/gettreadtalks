import { mutations, queries } from './model/affiliateLinks';

// Queries
export const getAffiliateLink = queries.getAffiliateLink;
export const getAffiliateLinkBySlug = queries.getAffiliateLinkBySlug;
export const listAffiliateLinks = queries.listAffiliateLinks;
export const listAffiliateLinksByAffiliate = queries.listAffiliateLinksByAffiliate;
export const listAffiliateLinksByType = queries.listAffiliateLinksByType;

// Mutations
export const createAffiliateLink = mutations.createAffiliateLink;
export const destroyAffiliateLink = mutations.destroyAffiliateLink;
export const updateAffiliateLink = mutations.updateAffiliateLink;
