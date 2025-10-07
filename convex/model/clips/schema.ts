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
    .index('by_speaker_id', ['speakerId'])
    .index('by_status_and_published_at', ['status', 'publishedAt'])
    .index('by_talk_id', ['talkId']),
};
