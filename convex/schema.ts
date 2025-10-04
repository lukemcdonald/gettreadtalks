import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// Common status type for content items
// Export for reuse in mutations and queries to maintain consistency
export const statusType = v.union(
  v.literal('backlog'),
  v.literal('approved'),
  v.literal('published'),
  v.literal('archived'),
);

// Common timestamp fields for audit trail
export const timestampFields = {
  createdAt: v.optional(v.number()),
  deletedAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
};

// Better Auth user ID (string)
export const userIdType = v.string();

const applicationTables = {
  affiliateLinks: defineTable({
    ...timestampFields,
    affiliate: v.optional(v.string()),
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    slug: v.string(),
    title: v.string(),
    type: v.union(
      v.literal('app'),
      v.literal('book'),
      v.literal('movie'),
      v.literal('music'),
      v.literal('podcast'),
    ),
    url: v.string(),
  })
    .index('by_featured', ['featured'])
    .index('by_slug', ['slug']),

  clips: defineTable({
    ...timestampFields,
    description: v.optional(v.string()),
    mediaUrl: v.string(),
    publishedAt: v.optional(v.number()),
    slug: v.string(),
    speakerId: v.optional(v.id('speakers')),
    status: statusType,
    talkId: v.optional(v.id('talks')),
    title: v.string(),
  })
    .index('by_slug', ['slug'])
    .index('by_speaker_id', ['speakerId'])
    .index('by_status_and_published_at', ['status', 'publishedAt'])
    .index('by_talk_id', ['talkId']),

  clipsOnTopics: defineTable({
    clipId: v.id('clips'),
    topicId: v.id('topics'),
  })
    .index('by_clip_id', ['clipId'])
    .index('by_topic_id', ['topicId']),

  collections: defineTable({
    ...timestampFields,
    description: v.optional(v.string()),
    slug: v.string(),
    title: v.string(),
    url: v.optional(v.string()),
  }).index('by_slug', ['slug']),

  speakers: defineTable({
    ...timestampFields,
    description: v.optional(v.string()),
    firstName: v.string(),
    imageUrl: v.optional(v.string()),
    lastName: v.string(),
    ministry: v.optional(v.string()),
    role: v.optional(v.string()),
    slug: v.string(),
    websiteUrl: v.optional(v.string()),
  })
    .index('by_last_name', ['lastName'])
    .index('by_slug', ['slug']),

  talks: defineTable({
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
  })
    .index('by_collection_id_and_order', ['collectionId', 'collectionOrder'])
    .index('by_collection_id_and_status', ['collectionId', 'status'])
    .index('by_slug', ['slug'])
    .index('by_speaker_id_and_status', ['speakerId', 'status'])
    .index('by_status_and_published_at', ['status', 'publishedAt']),

  talksOnTopics: defineTable({
    talkId: v.id('talks'),
    topicId: v.id('topics'),
  })
    .index('by_talk_id', ['talkId'])
    .index('by_topic_id', ['topicId']),

  topics: defineTable({
    ...timestampFields,
    slug: v.string(),
    title: v.string(),
  })
    .index('by_slug', ['slug'])
    .index('by_title', ['title']),

  userBookmarkedClips: defineTable({
    clipId: v.id('clips'),
    userId: userIdType,
  }).index('by_user_and_clip', ['userId', 'clipId']),

  userBookmarkedTalks: defineTable({
    talkId: v.id('talks'),
    userId: userIdType,
  }).index('by_user_and_talk', ['userId', 'talkId']),

  userFavoriteClips: defineTable({
    clipId: v.id('clips'),
    userId: userIdType,
  }).index('by_user_and_clip', ['userId', 'clipId']),

  userFavoriteSpeakers: defineTable({
    speakerId: v.id('speakers'),
    userId: userIdType,
  }).index('by_user_and_speaker', ['userId', 'speakerId']),

  userFavoriteTalks: defineTable({
    talkId: v.id('talks'),
    userId: userIdType,
  }).index('by_user_and_talk', ['userId', 'talkId']),
};

export default defineSchema(applicationTables);
