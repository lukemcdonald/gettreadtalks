import { mutations, queries } from './model/affiliateLinks';

// Queries
export const getAffiliateLink = queries.getAffiliateLink;
export const getAffiliateLinkBySlug = queries.getAffiliateLinkBySlug;
export const listAffiliateLinks = queries.getAffiliateLinks;
export const listAffiliateLinksByAffiliate = queries.getAffiliateLinksByAffiliate;
export const listAffiliateLinksByType = queries.getAffiliateLinksByType;

// Mutations
export const createAffiliateLink = mutations.createAffiliateLink;
export const destroyAffiliateLink = mutations.destroyAffiliateLink;
export const updateAffiliateLink = mutations.updateAffiliateLink;
