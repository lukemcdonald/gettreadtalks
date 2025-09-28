import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Enums mapped from DBML
export const ContentStatus = v.union(
  v.literal("backlog"),
  v.literal("approved"),
  v.literal("published"),
  v.literal("archived")
);

export const AffiliateType = v.union(
  v.literal("app"),
  v.literal("book"),
  v.literal("movie"),
  v.literal("music"),
  v.literal("podcast")
);

export default defineSchema({
  // Note: Better Auth component automatically manages auth-related tables
  // Remove manual users table definition to avoid conflicts

  // Speakers table
  speakers: defineTable({
    createdAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    description: v.optional(v.string()),
    firstName: v.string(),
    imageUrl: v.optional(v.string()),
    lastName: v.string(),
    ministry: v.optional(v.string()),
    role: v.optional(v.string()),
    slug: v.string(),
    updatedAt: v.optional(v.number()),
    websiteUrl: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_last_name", ["lastName"]),

  // Collections (formerly series)
  collections: defineTable({
    createdAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    description: v.optional(v.string()),
    slug: v.string(),
    title: v.string(),
    updatedAt: v.optional(v.number()),
    url: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  // Topics table
  topics: defineTable({
    createdAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    slug: v.string(),
    title: v.string(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_title", ["title"]),

  // Talks table (main content)
  talks: defineTable({
    collectionId: v.optional(v.id("collections")),
    collectionOrder: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    mediaUrl: v.string(),
    publishedAt: v.optional(v.number()),
    scripture: v.optional(v.string()),
    slug: v.string(),
    speakerId: v.id("speakers"),
    status: ContentStatus,
    title: v.string(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_published_at", ["publishedAt"])
    .index("by_speaker_id", ["speakerId"])
    .index("by_collection_id", ["collectionId"])
    .index("by_collection_id_and_order", ["collectionId", "collectionOrder"]),

  // Clips table (short-form content)
  clips: defineTable({
    createdAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    mediaUrl: v.string(),
    publishedAt: v.optional(v.number()),
    slug: v.string(),
    speakerId: v.optional(v.id("speakers")),
    status: ContentStatus,
    talkId: v.optional(v.id("talks")),
    title: v.string(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_published_at", ["publishedAt"])
    .index("by_speaker_id", ["speakerId"])
    .index("by_talk_id", ["talkId"]),

  // Junction table: talks_on_topics
  talksOnTopics: defineTable({
    talkId: v.id("talks"),
    topicId: v.id("topics"),
  })
    .index("by_talk_id", ["talkId"])
    .index("by_topic_id", ["topicId"]),

  // Junction table: clips_on_topics
  clipsOnTopics: defineTable({
    clipId: v.id("clips"),
    topicId: v.id("topics"),
  })
    .index("by_clip_id", ["clipId"])
    .index("by_topic_id", ["topicId"]),

  // User favorites: talks (userId will reference Better Auth managed users)
  userFavoriteTalks: defineTable({
    createdAt: v.optional(v.number()),
    talkId: v.id("talks"),
    userId: v.string(), // Better Auth user ID (string)
  })
    .index("by_user_and_talk", ["userId", "talkId"])
    .index("by_talk_id", ["talkId"]),

  // User favorites: clips
  userFavoriteClips: defineTable({
    clipId: v.id("clips"),
    createdAt: v.optional(v.number()),
    userId: v.string(), // Better Auth user ID (string)
  })
    .index("by_user_and_clip", ["userId", "clipId"])
    .index("by_clip_id", ["clipId"]),

  // User favorites: speakers
  userFavoriteSpeakers: defineTable({
    createdAt: v.optional(v.number()),
    speakerId: v.id("speakers"),
    userId: v.string(), // Better Auth user ID (string)
  })
    .index("by_user_and_speaker", ["userId", "speakerId"])
    .index("by_speaker_id", ["speakerId"]),

  // User bookmarks: talks
  userBookmarkedTalks: defineTable({
    createdAt: v.optional(v.number()),
    talkId: v.id("talks"),
    userId: v.string(), // Better Auth user ID (string)
  })
    .index("by_user_and_talk", ["userId", "talkId"])
    .index("by_talk_id", ["talkId"]),

  // User bookmarks: clips
  userBookmarkedClips: defineTable({
    clipId: v.id("clips"),
    createdAt: v.optional(v.number()),
    userId: v.string(), // Better Auth user ID (string)
  })
    .index("by_user_and_clip", ["userId", "clipId"])
    .index("by_clip_id", ["clipId"]),

  // Affiliate links
  affiliateLinks: defineTable({
    affiliate: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    slug: v.string(),
    title: v.string(),
    type: v.optional(AffiliateType),
    updatedAt: v.optional(v.number()),
    url: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_featured", ["featured"]),
});
