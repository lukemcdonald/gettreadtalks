import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getCurrentUser } from './model/auth/queries';
import {
  addUserFavoriteClip,
  addUserFavoriteSpeaker,
  addUserFavoriteTalk,
  removeUserFavoriteClip,
  removeUserFavoriteSpeaker,
  removeUserFavoriteTalk,
} from './model/users/mutations.js';
import { getUserFavorites } from './model/users/queries';

// ============================================
// QUERIES
// ============================================

export const list = query({
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
    const limit = args.limit ?? 100;

    const { clips, speakers, talks } = await getUserFavorites(ctx, userId, limit);

    return {
      clips,
      speakers,
      talks,
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

// ============================================
// MUTATIONS
// ============================================

export const addFavoriteClip = mutation({
  args: {
    clipId: v.id('clips'),
  },
  handler: async (ctx, args) => {
    return await addUserFavoriteClip(ctx, args);
  },
  returns: v.id('userFavoriteClips'),
});

export const addFavoriteSpeaker = mutation({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    return await addUserFavoriteSpeaker(ctx, args);
  },
  returns: v.id('userFavoriteSpeakers'),
});

export const addFavoriteTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    return await addUserFavoriteTalk(ctx, args);
  },
  returns: v.id('userFavoriteTalks'),
});

export const removeFavoriteClip = mutation({
  args: {
    clipId: v.id('clips'),
  },
  handler: async (ctx, args) => {
    return await removeUserFavoriteClip(ctx, args);
  },
  returns: v.null(),
});

export const removeFavoriteSpeaker = mutation({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    return await removeUserFavoriteSpeaker(ctx, args);
  },
  returns: v.null(),
});

export const removeFavoriteTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    return await removeUserFavoriteTalk(ctx, args);
  },
  returns: v.null(),
});
