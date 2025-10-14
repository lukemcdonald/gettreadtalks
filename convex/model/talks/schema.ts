import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { statusType, timestampFields } from '../../lib/validators';

export const talkFields = {
  ...timestampFields,
  collectionId: v.optional(v.id('collections')),
  collectionOrder: v.optional(v.number()),
  description: v.optional(v.string()),
  featured: v.optional(v.boolean()),
  mediaUrl: v.string(),
  publishedAt: v.optional(v.number()),
  scripture: v.optional(v.string()),
  slug: v.string(),
  speakerId: v.id('speakers'),
  status: statusType,
  title: v.string(),
};

export const talkTables = {
  talks: defineTable(talkFields)
    .index('by_collectionId_and_collectionOrder', ['collectionId', 'collectionOrder'])
    .index('by_collectionId_and_status', ['collectionId', 'status'])
    .index('by_featured_and_status', ['featured', 'status'])
    .index('by_slug', ['slug'])
    .index('by_speakerId_and_status', ['speakerId', 'status'])
    .index('by_status_and_publishedAt', ['status', 'publishedAt']),
};
