import { mutation, query } from './_generated/server';
import { authComponent, createAuth } from './auth';
import { mutations, queries, validators } from './model/users';

// ============================================
// QUERIES
// ============================================

export const isClipFavorited = query({
  args: validators.isClipFavoritedArgs,
  handler: async (ctx, args) => {
    return await queries.isClipFavorited(ctx, args);
  },
  returns: validators.isClipFavoritedReturns,
});

export const isSpeakerFavorited = query({
  args: validators.isSpeakerFavoritedArgs,
  handler: async (ctx, args) => {
    return await queries.isSpeakerFavorited(ctx, args);
  },
  returns: validators.isSpeakerFavoritedReturns,
});

export const isTalkFavorited = query({
  args: validators.isTalkFavoritedArgs,
  handler: async (ctx, args) => {
    return await queries.isTalkFavorited(ctx, args);
  },
  returns: validators.isTalkFavoritedReturns,
});

export const isTalkFinished = query({
  args: validators.isTalkFinishedArgs,
  handler: async (ctx, args) => {
    return await queries.isTalkFinished(ctx, args);
  },
  returns: validators.isTalkFinishedReturns,
});

export const listFavorites = query({
  args: validators.listUserFavoritesArgs,
  handler: async (ctx, args) => {
    return await queries.listUserFavorites(ctx, args);
  },
  returns: validators.listUserFavoritesReturns,
});

export const listFinished = query({
  args: validators.listUserFinishedTalksArgs,
  handler: async (ctx, args) => {
    return await queries.listUserFinishedTalks(ctx, args);
  },
  returns: validators.listUserFinishedTalksReturns,
});

// ============================================
// MUTATIONS
// ============================================

export const addFavoriteClip = mutation({
  args: validators.addFavoriteClipArgs,
  handler: async (ctx, args) => {
    return await mutations.addUserFavoriteClip(ctx, args);
  },
  returns: validators.addFavoriteClipReturns,
});

export const addFavoriteSpeaker = mutation({
  args: validators.addFavoriteSpeakerArgs,
  handler: async (ctx, args) => {
    return await mutations.addUserFavoriteSpeaker(ctx, args);
  },
  returns: validators.addFavoriteSpeakerReturns,
});

export const addFavoriteTalk = mutation({
  args: validators.addFavoriteTalkArgs,
  handler: async (ctx, args) => {
    return await mutations.addUserFavoriteTalk(ctx, args);
  },
  returns: validators.addFavoriteTalkReturns,
});

export const addFinishedTalk = mutation({
  args: validators.addFinishedTalkArgs,
  handler: async (ctx, args) => {
    return await mutations.addUserFinishedTalk(ctx, args);
  },
  returns: validators.addFinishedTalkReturns,
});

export const removeFavoriteClip = mutation({
  args: validators.removeFavoriteClipArgs,
  handler: async (ctx, args) => {
    return await mutations.removeUserFavoriteClip(ctx, args);
  },
  returns: validators.removeFavoriteClipReturns,
});

export const removeFavoriteSpeaker = mutation({
  args: validators.removeFavoriteSpeakerArgs,
  handler: async (ctx, args) => {
    return await mutations.removeUserFavoriteSpeaker(ctx, args);
  },
  returns: validators.removeFavoriteSpeakerReturns,
});

export const removeFavoriteTalk = mutation({
  args: validators.removeFavoriteTalkArgs,
  handler: async (ctx, args) => {
    return await mutations.removeUserFavoriteTalk(ctx, args);
  },
  returns: validators.removeFavoriteTalkReturns,
});

export const removeFinishedTalk = mutation({
  args: validators.removeFinishedTalkArgs,
  handler: async (ctx, args) => {
    return await mutations.removeUserFinishedTalk(ctx, args);
  },
  returns: validators.removeFinishedTalkReturns,
});

export const updatePassword = mutation({
  args: validators.updatePasswordArgs,
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
  returns: validators.updatePasswordReturns,
});
