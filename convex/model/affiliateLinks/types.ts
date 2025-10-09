import type { ObjectType } from 'convex/values';

import * as validators from './validators';

export type CreateAffiliateLinkArgs = ObjectType<typeof validators.createAffiliateLinkArgs>;
export type GetAffiliateLinkArgs = ObjectType<typeof validators.getAffiliateLinkArgs>;
export type GetAffiliateLinkBySlugArgs = ObjectType<typeof validators.getAffiliateLinkBySlugArgs>;
export type GetAffiliateLinksByAffiliateArgs = ObjectType<
  typeof validators.getAffiliateLinksByAffiliateArgs
>;
export type GetAffiliateLinksByTypeArgs = ObjectType<typeof validators.getAffiliateLinksByTypeArgs>;
export type ListAffiliateLinksArgs = ObjectType<typeof validators.listAffiliateLinksArgs>;
export type UpdateAffiliateLinkArgs = ObjectType<typeof validators.updateAffiliateLinkArgs>;
