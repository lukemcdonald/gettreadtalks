import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getCurrentUser } from './model/auth/queries';
import { getAllUserFavorites } from './model/users/queries';
import {
  addFavoriteClip as addFavoriteClipHelper,
  addFavoriteSpeaker as addFavoriteSpeakerHelper,
  addFavoriteTalk as addFavoriteTalkHelper,
  removeFavoriteClip as removeFavoriteClipHelper,
  removeFavoriteSpeaker as removeFavoriteSpeakerHelper,
  removeFavoriteTalk as removeFavoriteTalkHelper,
} from './model/users/mutations.js';
import { getDefaultLimit } from './utils';

export const getUserFavorites = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.object({
    clips: v.array(
      v.object({
        clipId: v.id('clips'),
        userId: v.string(),
      }),
    ),
    speakers: v.array(
      v.object({
        speakerId: v.id('speakers'),
        userId: v.string(),
      }),
    ),
    talks: v.array(
      v.object({
        talkId: v.id('talks'),
        userId: v.string(),
      }),
    ),
  }),
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return {
        clips: [],
        speakers: [],
        talks: [],
      };
    }

    const userId = user._id;
    const limit = args.limit || getDefaultLimit('main');

    const {
      clips: favoriteClips,
      speakers: favoriteSpeakers,
      talks: favoriteTalks,
    } = await getAllUserFavorites(ctx, userId, limit);

    return {
      clips: favoriteClips,
      speakers: favoriteSpeakers,
      talks: favoriteTalks,
    };
  },
});

export const addFavoriteTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  returns: v.id('userFavoriteTalks'),
  handler: async (ctx, args) => {
    return await addFavoriteTalkHelper(ctx, args);
  },
});

export const removeFavoriteTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    return await removeFavoriteTalkHelper(ctx, args);
  },
});

export const addFavoriteClip = mutation({
  args: {
    clipId: v.id('clips'),
  },
  returns: v.id('userFavoriteClips'),
  handler: async (ctx, args) => {
    return await addFavoriteClipHelper(ctx, args);
  },
});

export const removeFavoriteClip = mutation({
  args: {
    clipId: v.id('clips'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    return await removeFavoriteClipHelper(ctx, args);
  },
});

export const addFavoriteSpeaker = mutation({
  args: {
    speakerId: v.id('speakers'),
  },
  returns: v.id('userFavoriteSpeakers'),
  handler: async (ctx, args) => {
    return await addFavoriteSpeakerHelper(ctx, args);
  },
});

export const removeFavoriteSpeaker = mutation({
  args: {
    speakerId: v.id('speakers'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    return await removeFavoriteSpeakerHelper(ctx, args);
  },
});
