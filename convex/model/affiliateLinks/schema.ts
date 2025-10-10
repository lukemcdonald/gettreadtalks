import { defineTable } from 'convex/server';
import { Infer, v } from 'convex/values';

import { timestampFields } from '../../lib/validators';

const affiliateLinkTypes = v.union(
  v.literal('app'),
  v.literal('book'),
  v.literal('movie'),
  v.literal('music'),
  v.literal('podcast'),
);

export type AffiliateLinkType = Infer<typeof affiliateLinkTypes>;

export const affiliateLinkFields = {
  ...timestampFields,
  affiliate: v.optional(v.string()),
  description: v.optional(v.string()),
  featured: v.optional(v.boolean()),
  slug: v.string(),
  title: v.string(),
  type: affiliateLinkTypes,
  url: v.string(),
};

export const affiliateLinkTables = {
  affiliateLinks: defineTable(affiliateLinkFields)
    .index('by_affiliate', ['affiliate'])
    .index('by_featured', ['featured'])
    .index('by_slug', ['slug'])
    .index('by_type', ['type']),
};
