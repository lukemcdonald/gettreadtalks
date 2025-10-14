import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { statusType, timestampFields } from '../../lib/validators';

export const clipFields = {
  ...timestampFields,
  description: v.optional(v.string()),
  mediaUrl: v.string(),
  publishedAt: v.optional(v.number()),
  slug: v.string(),
  speakerId: v.optional(v.id('speakers')),
  status: statusType,
  talkId: v.optional(v.id('talks')),
  title: v.string(),
};

export const clipTables = {
  clips: defineTable(clipFields)
    .index('by_slug', ['slug'])
    .index('by_speakerId', ['speakerId'])
    .index('by_speakerId_and_status', ['speakerId', 'status'])
    .index('by_status_and_publishedAt', ['status', 'publishedAt'])
    .index('by_talkId', ['talkId'])
    .index('by_talkId_and_status', ['talkId', 'status']),
};
