import type { MutationCtx } from '../../_generated/server';
import type { Infer } from 'convex/values';

import { v } from 'convex/values';

import { affiliateLinkFields } from './schema';

const affiliateLinkValidator = v.object(affiliateLinkFields);

type AffiliateLinkFields = Infer<typeof affiliateLinkValidator>;

export function makeAffiliateLink(
  overrides: Partial<AffiliateLinkFields> = {}
): AffiliateLinkFields {
  return {
    slug: 'a-book',
    title: 'A book',
    type: 'book',
    url: 'https://example.test/book',
    ...overrides,
  };
}

export async function insertAffiliateLink(
  ctx: MutationCtx,
  overrides: Partial<AffiliateLinkFields> = {}
) {
  return await ctx.db.insert('affiliateLinks', makeAffiliateLink(overrides));
}
