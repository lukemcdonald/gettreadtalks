import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

export const getUserFavorites = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      return [];
    }

    const userId = user.userId || user._id;

    const favoriteClips = await ctx.db
      .query("userFavoriteClips")
      .withIndex("by_user_and_clip", (q) => q.eq("userId", userId))
      .collect();

    const favoriteSpeakers = await ctx.db
      .query("userFavoriteSpeakers")
      .withIndex("by_user_and_speaker", (q) => q.eq("userId", userId))
      .collect();

    const favoriteTalks = await ctx.db
      .query("userFavoriteTalks")
      .withIndex("by_user_and_talk", (q) => q.eq("userId", userId))
      .collect();

    return {
      clips: favoriteClips,
      speakers: favoriteSpeakers,
      talks: favoriteTalks,
    };
  },
});

export const addFavoriteTalk = mutation({
  args: {
    talkId: v.id("talks"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new Error("Authentication required");
    }

    const userId = user.userId || user._id;

    // Check if already favorited
    const existing = await ctx.db
      .query("userFavoriteTalks")
      .withIndex("by_user_and_talk", (q) => q.eq("userId", userId).eq("talkId", args.talkId))
      .first();

    if (existing) {
      throw new Error("Talk already favorited");
    }

    return await ctx.db.insert("userFavoriteTalks", {
      createdAt: Date.now(),
      talkId: args.talkId,
      userId: userId,
    });
  },
});

export const removeFavoriteTalk = mutation({
  args: {
    talkId: v.id("talks"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new Error("Authentication required");
    }

    const userId = user.userId || user._id;

    const favorite = await ctx.db
      .query("userFavoriteTalks")
      .withIndex("by_user_and_talk", (q) => q.eq("userId", userId).eq("talkId", args.talkId))
      .first();

    if (!favorite) {
      throw new Error("Favorite not found");
    }

    await ctx.db.delete(favorite._id);

    return null;
  },
});

export const addFavoriteClip = mutation({
  args: {
    clipId: v.id("clips"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new Error("Authentication required");
    }

    const userId = user.userId || user._id;

    // Check if already favorited
    const existing = await ctx.db
      .query("userFavoriteClips")
      .withIndex("by_user_and_clip", (q) => q.eq("userId", userId).eq("clipId", args.clipId))
      .first();

    if (existing) {
      throw new Error("Clip already favorited");
    }

    return await ctx.db.insert("userFavoriteClips", {
      clipId: args.clipId,
      createdAt: Date.now(),
      userId: userId,
    });
  },
});

export const removeFavoriteClip = mutation({
  args: {
    clipId: v.id("clips"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new Error("Authentication required");
    }

    const userId = user.userId || user._id;

    const favorite = await ctx.db
      .query("userFavoriteClips")
      .withIndex("by_user_and_clip", (q) => q.eq("userId", userId).eq("clipId", args.clipId))
      .first();

    if (!favorite) {
      throw new Error("Favorite not found");
    }

    await ctx.db.delete(favorite._id);

    return null;
  },
});

export const addFavoriteSpeaker = mutation({
  args: {
    speakerId: v.id("speakers"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new Error("Authentication required");
    }

    const userId = user.userId || user._id;

    // Check if already favorited
    const existing = await ctx.db
      .query("userFavoriteSpeakers")
      .withIndex("by_user_and_speaker", (q) =>
        q.eq("userId", userId).eq("speakerId", args.speakerId)
      )
      .first();

    if (existing) {
      throw new Error("Speaker already favorited");
    }

    return await ctx.db.insert("userFavoriteSpeakers", {
      createdAt: Date.now(),
      speakerId: args.speakerId,
      userId: userId,
    });
  },
});

export const removeFavoriteSpeaker = mutation({
  args: {
    speakerId: v.id("speakers"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new Error("Authentication required");
    }

    const userId = user.userId || user._id;

    const favorite = await ctx.db
      .query("userFavoriteSpeakers")
      .withIndex("by_user_and_speaker", (q) =>
        q.eq("userId", userId).eq("speakerId", args.speakerId)
      )
      .first();

    if (!favorite) {
      throw new Error("Favorite not found");
    }

    await ctx.db.delete(favorite._id);

    return null;
  },
});
