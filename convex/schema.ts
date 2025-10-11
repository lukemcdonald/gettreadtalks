import { defineSchema, defineTable } from 'convex/server';
import { Infer, v } from 'convex/values';

import { statusType } from './lib/validators';
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
    .index('by_clip_id', ['clipId'])
    .index('by_clip_id_and_topic_id', ['clipId', 'topicId'])
    .index('by_topic_id', ['topicId']),

  talksOnTopics: defineTable({
    talkId: v.id('talks'),
    topicId: v.id('topics'),
  })
    .index('by_talk_id', ['talkId'])
    .index('by_talk_id_and_topic_id', ['talkId', 'topicId'])
    .index('by_topic_id', ['topicId']),

  userFavoriteClips: defineTable({
    clipId: v.id('clips'),
    userId: v.string(),
  }).index('by_user_and_clip', ['userId', 'clipId']),

  userFavoriteSpeakers: defineTable({
    speakerId: v.id('speakers'),
    userId: v.string(),
  })
    .index('by_speaker_id', ['speakerId'])
    .index('by_user_and_speaker', ['userId', 'speakerId']),

  userFavoriteTalks: defineTable({
    talkId: v.id('talks'),
    userId: v.string(),
  }).index('by_user_and_talk', ['userId', 'talkId']),

  userFinishedTalks: defineTable({
    talkId: v.id('talks'),
    userId: v.string(),
  })
    .index('by_user', ['userId'])
    .index('by_user_and_talk', ['userId', 'talkId']),
});
