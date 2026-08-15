import { mutations, queries } from './model/affiliateLinks';

// Queries
export const {
  getAffiliateLink,
  getAffiliateLinkBySlug,
  listAffiliateLinks,
  listAffiliateLinksByAffiliate,
  listAffiliateLinksByType,
} = queries;

// Mutations
export const {
  createAffiliateLink,
  destroyAffiliateLink,
  updateAffiliateLink,
} = mutations;
