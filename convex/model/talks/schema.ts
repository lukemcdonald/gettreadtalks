import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { statusType, timestampFields } from '../../lib/validators';

export const talkFields = {
  ...timestampFields,
  collectionId: v.optional(v.id('collections')),
  collectionOrder: v.optional(v.number()),
  description: v.optional(v.string()),
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
    .index('by_collection_id_and_order', ['collectionId', 'collectionOrder'])
    .index('by_collection_id_and_status', ['collectionId', 'status'])
    .index('by_slug', ['slug'])
    .index('by_speaker_id_and_status', ['speakerId', 'status'])
    .index('by_status_and_published_at', ['status', 'publishedAt']),
};
