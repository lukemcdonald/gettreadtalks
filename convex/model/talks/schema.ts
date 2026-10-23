import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { statusType, timestampFields } from '../../lib/validators';
import {
  talkStudyContentFields,
  talkStudyStatus,
  talkTranscriptFetchErrorCode,
  talkTranscriptFetchStatus,
  talkTranscriptQuality,
  talkTranscriptSource,
  talkTranscriptStatus,
} from './validators';

export const talkFields = {
  ...timestampFields,
  collectionId: v.optional(v.id('collections')),
  collectionOrder: v.optional(v.number()),
  // Pending removal after unsetTalkDescriptions runs on prod.
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

export const talkStudyFields = {
  generatedAt: v.number(),
  generator: v.string(),
  manuallyEditedAt: v.optional(v.number()),
  ...talkStudyContentFields,
  studyStatus: talkStudyStatus,
  talkId: v.id('talks'),
};

export const talkTranscriptFields = {
  failureReason: v.optional(v.string()),
  fetchedAt: v.optional(v.number()),
  mediaUrlHash: v.optional(v.string()),
  model: v.optional(v.string()),
  quality: v.optional(talkTranscriptQuality),
  source: talkTranscriptSource,
  sourceUrl: v.optional(v.string()),
  status: talkTranscriptStatus,
  talkId: v.id('talks'),
  text: v.optional(v.string()),
  wordCount: v.optional(v.number()),
};

export const talkTranscriptFetchFields = {
  checkedAt: v.number(),
  errorCode: v.optional(talkTranscriptFetchErrorCode),
  message: v.optional(v.string()),
  retryAfter: v.optional(v.number()),
  status: talkTranscriptFetchStatus,
  talkId: v.id('talks'),
};

export const talkTables = {
  talkStudies: defineTable(talkStudyFields)
    .index('by_studyStatus', ['studyStatus'])
    .index('by_talkId', ['talkId']),
  talkTranscriptFetches: defineTable(talkTranscriptFetchFields).index(
    'by_talkId',
    ['talkId']
  ),
  talkTranscripts: defineTable(talkTranscriptFields).index('by_talkId', [
    'talkId',
  ]),
  talks: defineTable(talkFields)
    .index('by_collectionId_and_collectionOrder', [
      'collectionId',
      'collectionOrder',
    ])
    .index('by_collectionId_and_status', ['collectionId', 'status'])
    .index('by_featured_and_status', ['featured', 'status'])
    .index('by_slug', ['slug'])
    .index('by_speakerId_and_status', ['speakerId', 'status'])
    .index('by_status_and_publishedAt', ['status', 'publishedAt'])
    .searchIndex('search_title', {
      filterFields: ['status'],
      searchField: 'title',
    }),
};
