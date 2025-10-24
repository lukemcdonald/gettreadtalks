import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { authComponent, createAuth } from './auth';
import { mutations, queries } from './model/users';

// ============================================
// QUERIES
// ============================================

export const isClipFavorited = query({
  args: {
    clipId: v.id('clips'),
  },
  handler: async (ctx, args) => {
    return await queries.isClipFavorited(ctx, args);
  },
  returns: v.boolean(),
});

export const isSpeakerFavorited = query({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    return await queries.isSpeakerFavorited(ctx, args);
  },
  returns: v.boolean(),
});

export const isTalkFavorited = query({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    return await queries.isTalkFavorited(ctx, args);
  },
  returns: v.boolean(),
});

export const isTalkFinished = query({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    return await queries.isTalkFinished(ctx, args);
  },
  returns: v.boolean(),
});

export const listFavorites = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await queries.listUserFavorites(ctx, args);
  },
  returns: v.any(), // Complex return type with favorites
});

export const listFinishedTalks = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await queries.listUserFinishedTalks(ctx, args);
  },
  returns: v.any(), // Complex return type with finished talks
});

// ============================================
// MUTATIONS
// ============================================

export const favoriteClip = mutation({
  args: {
    clipId: v.id('clips'),
  },
  handler: async (ctx, args) => {
    return await mutations.favoriteClip(ctx, args);
  },
  returns: v.id('userFavoriteClips'),
});

export const favoriteSpeaker = mutation({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    return await mutations.favoriteSpeaker(ctx, args);
  },
  returns: v.id('userFavoriteSpeakers'),
});

export const favoriteTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    return await mutations.favoriteTalk(ctx, args);
  },
  returns: v.id('userFavoriteTalks'),
});

export const finishTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    return await mutations.finishTalk(ctx, args);
  },
  returns: v.id('userFinishedTalks'),
});

export const unfavoriteClip = mutation({
  args: {
    clipId: v.id('clips'),
  },
  handler: async (ctx, args) => {
    return await mutations.unfavoriteClip(ctx, args);
  },
  returns: v.null(),
});

export const unfavoriteSpeaker = mutation({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    return await mutations.unfavoriteSpeaker(ctx, args);
  },
  returns: v.null(),
});

export const unfavoriteTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    return await mutations.unfavoriteTalk(ctx, args);
  },
  returns: v.null(),
});

export const unfinishTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    return await mutations.unfinishTalk(ctx, args);
  },
  returns: v.null(),
});

export const updatePassword = mutation({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    await createAuth(ctx).api.changePassword({
      body: {
        currentPassword: args.currentPassword,
        newPassword: args.newPassword,
      },
      headers: await authComponent.getHeaders(ctx),
    });

    return null;
  },
  returns: v.null(),
});
