import { defineTable } from 'convex/server';
import { type Infer, v } from 'convex/values';

import { timestampFields } from '../../lib/validators';
import { affiliateLinkTypes } from './validators';

export type AffiliateLinkType = Infer<typeof affiliateLinkTypes>;

export const affiliateLinkFields = {
  ...timestampFields,
  affiliate: v.optional(v.string()),
  description: v.optional(v.string()),
  featured: v.optional(v.boolean()),
  imageUrl: v.optional(v.string()),
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
