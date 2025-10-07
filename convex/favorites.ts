import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getDefaultLimit } from './lib/utils';
import { getCurrentUser } from './model/auth/queries';
import {
  addFavoriteClip as addFavoriteClipHelper,
  addFavoriteSpeaker as addFavoriteSpeakerHelper,
  addFavoriteTalk as addFavoriteTalkHelper,
  removeFavoriteClip as removeFavoriteClipHelper,
  removeFavoriteSpeaker as removeFavoriteSpeakerHelper,
  removeFavoriteTalk as removeFavoriteTalkHelper,
} from './model/users/mutations.js';
import { getAllUserFavorites } from './model/users/queries';

export const getUserFavorites = query({
  args: {
    limit: v.optional(v.number()),
  },
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
});

export const addFavoriteTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    return await addFavoriteTalkHelper(ctx, args);
  },
  returns: v.id('userFavoriteTalks'),
});

export const removeFavoriteTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    return await removeFavoriteTalkHelper(ctx, args);
  },
  returns: v.null(),
});

export const addFavoriteClip = mutation({
  args: {
    clipId: v.id('clips'),
  },
  handler: async (ctx, args) => {
    return await addFavoriteClipHelper(ctx, args);
  },
  returns: v.id('userFavoriteClips'),
});

export const removeFavoriteClip = mutation({
  args: {
    clipId: v.id('clips'),
  },
  handler: async (ctx, args) => {
    return await removeFavoriteClipHelper(ctx, args);
  },
  returns: v.null(),
});

export const addFavoriteSpeaker = mutation({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    return await addFavoriteSpeakerHelper(ctx, args);
  },
  returns: v.id('userFavoriteSpeakers'),
});

export const removeFavoriteSpeaker = mutation({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    return await removeFavoriteSpeakerHelper(ctx, args);
  },
  returns: v.null(),
});
