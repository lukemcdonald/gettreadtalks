import type { Infer, ObjectType } from 'convex/values';

import * as validators from './validators';

export type CreateAffiliateLinkArgs = ObjectType<typeof validators.createAffiliateLinkArgs>;
export type CreateAffiliateLinkReturns = Infer<typeof validators.createAffiliateLinkReturns>;
export type RemoveAffiliateLinkArgs = ObjectType<typeof validators.removeAffiliateLinkArgs>;
export type RemoveAffiliateLinkReturns = Infer<typeof validators.removeAffiliateLinkReturns>;
export type GetAffiliateLinkArgs = ObjectType<typeof validators.getAffiliateLinkArgs>;
export type GetAffiliateLinkBySlugArgs = ObjectType<typeof validators.getAffiliateLinkBySlugArgs>;
export type GetAffiliateLinkBySlugReturns = Infer<typeof validators.getAffiliateLinkBySlugReturns>;
export type GetAffiliateLinkReturns = Infer<typeof validators.getAffiliateLinkReturns>;
export type ListAffiliateLinksArgs = ObjectType<typeof validators.listAffiliateLinksArgs>;
export type ListAffiliateLinksByAffiliateArgs = ObjectType<
  typeof validators.listAffiliateLinksByAffiliateArgs
>;
export type ListAffiliateLinksByAffiliateReturns = Infer<
  typeof validators.listAffiliateLinksByAffiliateReturns
>;
export type ListAffiliateLinksByTypeArgs = ObjectType<
  typeof validators.listAffiliateLinksByTypeArgs
>;
export type ListAffiliateLinksByTypeReturns = Infer<
  typeof validators.listAffiliateLinksByTypeReturns
>;
export type ListAffiliateLinksReturns = Infer<typeof validators.listAffiliateLinksReturns>;
export type UpdateAffiliateLinkArgs = ObjectType<typeof validators.updateAffiliateLinkArgs>;
export type UpdateAffiliateLinkReturns = Infer<typeof validators.updateAffiliateLinkReturns>;
