import type { Infer, ObjectType } from 'convex/values';

import * as validators from './validators';

export type CreateAffiliateLinkArgs = ObjectType<typeof validators.createAffiliateLinkArgs>;
export type CreateAffiliateLinkReturns = Infer<typeof validators.createAffiliateLinkReturns>;
export type GetAffiliateLinkArgs = ObjectType<typeof validators.getAffiliateLinkArgs>;
export type GetAffiliateLinkBySlugArgs = ObjectType<typeof validators.getAffiliateLinkBySlugArgs>;
export type GetAffiliateLinkBySlugReturns = Infer<typeof validators.getAffiliateLinkBySlugReturns>;
export type GetAffiliateLinkReturns = Infer<typeof validators.getAffiliateLinkReturns>;
export type GetAffiliateLinksByAffiliateArgs = ObjectType<
  typeof validators.getAffiliateLinksByAffiliateArgs
>;
export type GetAffiliateLinksByAffiliateReturns = Infer<
  typeof validators.getAffiliateLinksByAffiliateReturns
>;
export type GetAffiliateLinksByTypeArgs = ObjectType<typeof validators.getAffiliateLinksByTypeArgs>;
export type GetAffiliateLinksByTypeReturns = Infer<
  typeof validators.getAffiliateLinksByTypeReturns
>;
export type ListAffiliateLinksArgs = ObjectType<typeof validators.listAffiliateLinksArgs>;
export type ListAffiliateLinksReturns = Infer<typeof validators.listAffiliateLinksReturns>;
export type UpdateAffiliateLinkArgs = ObjectType<typeof validators.updateAffiliateLinkArgs>;
export type UpdateAffiliateLinkReturns = Infer<typeof validators.updateAffiliateLinkReturns>;
