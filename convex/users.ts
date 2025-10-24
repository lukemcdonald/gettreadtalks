import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { authComponent, createAuth } from './auth';
import { mutations, queries } from './model/users';

export const favoriteClip = mutations.favoriteClip;
export const favoriteSpeaker = mutations.favoriteSpeaker;
export const favoriteTalk = mutations.favoriteTalk;
export const finishTalk = mutations.finishTalk;
export const isClipFavorited = queries.isClipFavorited;
export const isSpeakerFavorited = queries.isSpeakerFavorited;
export const isTalkFavorited = queries.isTalkFavorited;
export const isTalkFinished = queries.isTalkFinished;
export const listFavorites = queries.listUserFavorites;
export const listFinishedTalks = queries.listUserFinishedTalks;
export const unfavoriteClip = mutations.unfavoriteClip;
export const unfavoriteSpeaker = mutations.unfavoriteSpeaker;
export const unfavoriteTalk = mutations.unfavoriteTalk;
export const unfinishTalk = mutations.unfinishTalk;

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
