import { query } from "./_generated/server";
import { v } from "convex/values";

// Get published talks with pagination
export const getPublishedTalks = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const talks = await ctx.db
      .query("talks")
      .withIndex("by_published_at")
      .filter((q) => q.eq(q.field("status"), "published"))
      .order("desc")
      .take(limit);

    // Fetch speaker information for each talk
    const talksWithSpeakers = await Promise.all(
      talks.map(async (talk) => {
        const speaker = await ctx.db.get(talk.speakerId);
        return {
          ...talk,
          speaker,
        };
      })
    );

    return talksWithSpeakers;
  },
});

// Get talk by slug
export const getTalkBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const talk = await ctx.db
      .query("talks")
      .withIndex("by_slug")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .unique();

    if (!talk) {
      return null;
    }

    // Fetch speaker information
    const speaker = await ctx.db.get(talk.speakerId);

    // Fetch collection if exists
    let collection = null;
    if (talk.collectionId) {
      collection = await ctx.db.get(talk.collectionId);
    }

    return {
      ...talk,
      collection,
      speaker,
    };
  },
});
