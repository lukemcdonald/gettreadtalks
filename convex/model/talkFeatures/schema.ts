import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { talkFeatureKind, talkFeatureStatus } from './validators';

export const talkFeatureFields = {
  body: v.string(),
  generatedAt: v.number(),
  kind: talkFeatureKind,
  manuallyEditedAt: v.optional(v.number()),
  status: talkFeatureStatus,
  talkId: v.id('talks'),
  updatedAt: v.number(),
};

export const talkFeatureTables = {
  talkFeatures: defineTable(talkFeatureFields).index('by_talkId_and_kind', [
    'talkId',
    'kind',
  ]),
};
