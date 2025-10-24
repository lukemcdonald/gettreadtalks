import { mutations, queries } from './model/affiliateLinks';

export const create = mutations.createAffiliateLink;
export const destroy = mutations.destroyAffiliateLink;
export const get = queries.getAffiliateLink;
export const getBySlug = queries.getAffiliateLinkBySlug;
export const list = queries.getAffiliateLinks;
export const listByAffiliate = queries.getAffiliateLinksByAffiliate;
export const listByType = queries.getAffiliateLinksByType;
export const update = mutations.updateAffiliateLink;
