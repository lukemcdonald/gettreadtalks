import { defineSchema, defineTable } from 'convex/server';
import { Infer, v } from 'convex/values';

import { clipTables } from './model/clips/schema';
import { collectionTables } from './model/collections/schema';
import { speakerTables } from './model/speakers/schema';
import { affiliateLinkTables } from './model/affiliateLinks/schema';
import { talkTables } from './model/talks/schema';
import { topicTables } from './model/topics/schema';

// Common status type for content items
// Export for reuse in mutations and queries to maintain consistency
export const statusType = v.union(
  v.literal('backlog'),
  v.literal('approved'),
  v.literal('published'),
  v.literal('archived'),
);
export type StatusType = Infer<typeof statusType>;

export const timestampFields = {
  // Note: Convex provides a `_creationTime` field automatically
  deletedAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
};

export const userFavoriteClipFields = {
  clipId: v.id('clips'),
  userId: v.string(),
};

export const userFavoriteSpeakerFields = {
  speakerId: v.id('speakers'),
  userId: v.string(),
};

export const userFavoriteTalkFields = {
  talkId: v.id('talks'),
  userId: v.string(),
};

export default defineSchema({
  ...affiliateLinkTables,
  ...clipTables,
  ...collectionTables,
  ...speakerTables,
  ...talkTables,
  ...topicTables,

  clipsOnTopics: defineTable({
    clipId: v.id('clips'),
    topicId: v.id('topics'),
  })
    .index('by_clip_id', ['clipId'])
    .index('by_topic_id', ['topicId']),

  talksOnTopics: defineTable({
    talkId: v.id('talks'),
    topicId: v.id('topics'),
  })
    .index('by_talk_id', ['talkId'])
    .index('by_topic_id', ['topicId']),

  userFavoriteClips: defineTable(userFavoriteClipFields).index('by_user_and_clip', [
    'userId',
    'clipId',
  ]),

  userFavoriteSpeakers: defineTable(userFavoriteSpeakerFields).index('by_user_and_speaker', [
    'userId',
    'speakerId',
  ]),

  userFavoriteTalks: defineTable(userFavoriteTalkFields).index('by_user_and_talk', [
    'userId',
    'talkId',
  ]),
});
