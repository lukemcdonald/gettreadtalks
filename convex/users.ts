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

export const listFinishedTalks = query({
  args: validators.listUserFinishedTalksArgs,
  handler: async (ctx, args) => {
    return await queries.listUserFinishedTalks(ctx, args);
  },
  returns: validators.listUserFinishedTalksReturns,
});

// ============================================
// MUTATIONS
// ============================================

export const favoriteClip = mutation({
  args: validators.favoriteClipArgs,
  handler: async (ctx, args) => {
    return await mutations.favoriteClip(ctx, args);
  },
  returns: validators.favoriteClipReturns,
});

export const favoriteSpeaker = mutation({
  args: validators.favoriteSpeakerArgs,
  handler: async (ctx, args) => {
    return await mutations.favoriteSpeaker(ctx, args);
  },
  returns: validators.favoriteSpeakerReturns,
});

export const favoriteTalk = mutation({
  args: validators.favoriteTalkArgs,
  handler: async (ctx, args) => {
    return await mutations.favoriteTalk(ctx, args);
  },
  returns: validators.favoriteTalkReturns,
});

export const finishTalk = mutation({
  args: validators.finishTalkArgs,
  handler: async (ctx, args) => {
    return await mutations.finishTalk(ctx, args);
  },
  returns: validators.finishTalkReturns,
});

export const unfavoriteClip = mutation({
  args: validators.unfavoriteClipArgs,
  handler: async (ctx, args) => {
    return await mutations.unfavoriteClip(ctx, args);
  },
  returns: validators.unfavoriteClipReturns,
});

export const unfavoriteSpeaker = mutation({
  args: validators.unfavoriteSpeakerArgs,
  handler: async (ctx, args) => {
    return await mutations.unfavoriteSpeaker(ctx, args);
  },
  returns: validators.unfavoriteSpeakerReturns,
});

export const unfavoriteTalk = mutation({
  args: validators.unfavoriteTalkArgs,
  handler: async (ctx, args) => {
    return await mutations.unfavoriteTalk(ctx, args);
  },
  returns: validators.unfavoriteTalkReturns,
});

export const unfinishTalk = mutation({
  args: validators.unfinishTalkArgs,
  handler: async (ctx, args) => {
    return await mutations.unfinishTalk(ctx, args);
  },
  returns: validators.unfinishTalkReturns,
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
