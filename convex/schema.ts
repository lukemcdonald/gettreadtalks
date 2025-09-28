import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const userIdType = v.string(); // Better Auth user ID (string)

const applicationTables = {
  affiliateLinks: defineTable({
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    affiliate: v.optional(v.string()),
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    slug: v.string(),
    title: v.string(),
    type: v.optional(
      v.union(
        v.literal("app"),
        v.literal("book"),
        v.literal("movie"),
        v.literal("music"),
        v.literal("podcast")
      )
    ),
    url: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_featured", ["featured"]),

  clips: defineTable({
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    mediaUrl: v.string(),
    publishedAt: v.optional(v.number()),
    slug: v.string(),
    speakerId: v.optional(v.id("speakers")),
    status: v.union(
      v.literal("backlog"),
      v.literal("approved"),
      v.literal("published"),
      v.literal("archived")
    ),
    talkId: v.optional(v.id("talks")),
    title: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_published_at", ["publishedAt"])
    .index("by_speaker_id", ["speakerId"])
    .index("by_talk_id", ["talkId"]),

  clipsOnTopics: defineTable({
    clipId: v.id("clips"),
    topicId: v.id("topics"),
  })
    .index("by_clip_id", ["clipId"])
    .index("by_topic_id", ["topicId"]),

  collections: defineTable({
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    description: v.optional(v.string()),
    slug: v.string(),
    title: v.string(),
    url: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  speakers: defineTable({
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    description: v.optional(v.string()),
    firstName: v.string(),
    imageUrl: v.optional(v.string()),
    lastName: v.string(),
    ministry: v.optional(v.string()),
    role: v.optional(v.string()),
    slug: v.string(),
    websiteUrl: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_last_name", ["lastName"]),

  talks: defineTable({
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    collectionId: v.optional(v.id("collections")),
    collectionOrder: v.optional(v.number()),
    mediaUrl: v.string(),
    publishedAt: v.optional(v.number()),
    scripture: v.optional(v.string()),
    slug: v.string(),
    speakerId: v.id("speakers"),
    status: v.union(
      v.literal("backlog"),
      v.literal("approved"),
      v.literal("published"),
      v.literal("archived")
    ),
    title: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_published_at", ["publishedAt"])
    .index("by_speaker_id", ["speakerId"])
    .index("by_collection_id_and_order", ["collectionId", "collectionOrder"]),

  talksOnTopics: defineTable({
    talkId: v.id("talks"),
    topicId: v.id("topics"),
  })
    .index("by_talk_id", ["talkId"])
    .index("by_topic_id", ["topicId"]),

  topics: defineTable({
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    slug: v.string(),
    title: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_title", ["title"]),

  userBookmarkedClips: defineTable({
    createdAt: v.optional(v.number()),
    clipId: v.id("clips"),
    userId: userIdType,
  })
    .index("by_user_and_clip", ["userId", "clipId"])
    .index("by_clip_id", ["clipId"]),

  userBookmarkedTalks: defineTable({
    createdAt: v.optional(v.number()),
    talkId: v.id("talks"),
    userId: userIdType,
  })
    .index("by_user_and_talk", ["userId", "talkId"])
    .index("by_talk_id", ["talkId"]),

  userFavoriteClips: defineTable({
    createdAt: v.optional(v.number()),
    clipId: v.id("clips"),
    userId: userIdType,
  })
    .index("by_user_and_clip", ["userId", "clipId"])
    .index("by_clip_id", ["clipId"]),

  userFavoriteTalks: defineTable({
    createdAt: v.optional(v.number()),
    talkId: v.id("talks"),
    userId: userIdType,
  })
    .index("by_user_and_talk", ["userId", "talkId"])
    .index("by_talk_id", ["talkId"]),

  userFavoriteSpeakers: defineTable({
    createdAt: v.optional(v.number()),
    speakerId: v.id("speakers"),
    userId: userIdType,
  })
    .index("by_user_and_speaker", ["userId", "speakerId"])
    .index("by_speaker_id", ["speakerId"]),
};

export default defineSchema(applicationTables);
