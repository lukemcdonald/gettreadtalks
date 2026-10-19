import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import {
  mediaCheckEntityTable,
  mediaCheckState,
  mediaCheckStatus,
} from './validators';

export const mediaHealthTables = {
  mediaChecks: defineTable({
    checkedAt: v.number(),
    entityId: v.string(),
    entityTable: mediaCheckEntityTable,
    firstBrokenAt: v.optional(v.number()),
    lastNotifiedAt: v.optional(v.number()),
    lastNotifiedStatus: v.optional(mediaCheckStatus),
    mediaUrl: v.string(),
    state: v.optional(mediaCheckState),
    status: mediaCheckStatus,
  })
    .index('by_entityTable_and_entityId_and_mediaUrl', [
      'entityTable',
      'entityId',
      'mediaUrl',
    ])
    .index('by_state', ['state']),
};
