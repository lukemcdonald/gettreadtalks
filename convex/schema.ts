import type { statusType } from './lib/validators';

import { defineSchema, defineTable } from 'convex/server';
import { type Infer, v } from 'convex/values';

import { affiliateLinkTables } from './model/affiliateLinks/schema';
import { clipTables } from './model/clips/schema';
import { collectionTables } from './model/collections/schema';
import { speakerTables } from './model/speakers/schema';
import { talkTables } from './model/talks/schema';
import { topicTables } from './model/topics/schema';

export type StatusType = Infer<typeof statusType>;

export default defineSchema({
  ...affiliateLinkTables,
  ...clipTables,
  ...collectionTables,
  ...speakerTables,
  ...talkTables,
  ...topicTables,

  // Join tables
  clipsOnTopics: defineTable({
    clipId: v.id('clips'),
    topicId: v.id('topics'),
  })
    .index('by_clipId', ['clipId'])
    .index('by_clipId_and_topicId', ['clipId', 'topicId'])
    .index('by_topicId', ['topicId']),

  talksOnTopics: defineTable({
    talkId: v.id('talks'),
    topicId: v.id('topics'),
  })
    .index('by_talkId', ['talkId'])
    .index('by_talkId_and_topicId', ['talkId', 'topicId'])
    .index('by_topicId', ['topicId']),

  userFavoriteClips: defineTable({
    clipId: v.id('clips'),
    userId: v.string(),
  }).index('by_userId_and_clipId', ['userId', 'clipId']),

  userFavoriteSpeakers: defineTable({
    speakerId: v.id('speakers'),
    userId: v.string(),
  })
    .index('by_speakerId', ['speakerId'])
    .index('by_userId_and_speakerId', ['userId', 'speakerId']),

  userFavoriteTalks: defineTable({
    talkId: v.id('talks'),
    userId: v.string(),
  }).index('by_userId_and_talkId', ['userId', 'talkId']),

  userFinishedTalks: defineTable({
    talkId: v.id('talks'),
    userId: v.string(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_and_talkId', ['userId', 'talkId']),
});
