import { defineSchema, defineTable } from 'convex/server';
import { Infer, v } from 'convex/values';

// Common status type for content items
// Export for reuse in mutations and queries to maintain consistency
export const statusType = v.union(
  v.literal('backlog'),
  v.literal('approved'),
  v.literal('published'),
  v.literal('archived'),
);
export type StatusType = Infer<typeof statusType>;

// Common timestamp fields for audit trail
export const timestampFields = {
  // Note: Convex provides a `_creationTime` field automatically
  deletedAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
};

export const affiliateLinkFields = {
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
};

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

export const speakerFields = {
  ...timestampFields,
  description: v.optional(v.string()),
  firstName: v.string(),
  imageUrl: v.optional(v.string()),
  lastName: v.string(),
  ministry: v.optional(v.string()),
  role: v.optional(v.string()),
  slug: v.string(),
  websiteUrl: v.optional(v.string()),
};

export const topicFields = {
  ...timestampFields,
  slug: v.string(),
  title: v.string(),
};

export const talkFields = {
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
};

export const collectionFields = {
  ...timestampFields,
  description: v.optional(v.string()),
  slug: v.string(),
  title: v.string(),
  url: v.optional(v.string()),
};

// Join table field objects
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
  affiliateLinks: defineTable(affiliateLinkFields)
    .index('by_featured', ['featured'])
    .index('by_slug', ['slug']),

  clips: defineTable(clipFields)
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

  collections: defineTable(collectionFields).index('by_slug', ['slug']),

  speakers: defineTable(speakerFields)
    .index('by_last_name', ['lastName'])
    .index('by_slug', ['slug']),

  talks: defineTable(talkFields)
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

  topics: defineTable(topicFields).index('by_slug', ['slug']).index('by_title', ['title']),

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
