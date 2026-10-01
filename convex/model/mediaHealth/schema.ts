import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { mediaCheckEntityTable, mediaCheckStatus } from './validators';

export const mediaHealthTables = {
  mediaChecks: defineTable({
    checkedAt: v.number(),
    entityId: v.string(),
    entityTable: mediaCheckEntityTable,
    lastNotifiedStatus: v.optional(mediaCheckStatus),
    mediaUrl: v.string(),
    status: mediaCheckStatus,
  }).index('by_entityTable_and_entityId_and_mediaUrl', [
    'entityTable',
    'entityId',
    'mediaUrl',
  ]),
};
