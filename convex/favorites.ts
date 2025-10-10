import { mutation, query } from './_generated/server';
import { mutations, queries, validators } from './model/users';

// ============================================
// QUERIES
// ============================================

export const list = query({
  args: validators.listUserFavoritesArgs,
  handler: async (ctx, args) => {
    return await queries.listUserFavorites(ctx, args);
  },
  returns: validators.listUserFavoritesReturns,
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
