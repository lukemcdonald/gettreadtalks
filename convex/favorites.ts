import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getCurrentUser, getUserId } from './model/auth/queries';
import { getAllUserFavorites } from './model/users';
import { getDefaultLimit } from './utils';
import {
  userFavoriteClipFields,
  userFavoriteSpeakerFields,
  userFavoriteTalkFields,
} from './schema';

// Returns user's favorite clips, speakers, and talks (join table records)
// Always returns consistent object shape, with empty arrays when not authenticated
export const getUserFavorites = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.object({
    clips: v.array(v.object(userFavoriteClipFields)),
    speakers: v.array(v.object(userFavoriteSpeakerFields)),
    talks: v.array(v.object(userFavoriteTalkFields)),
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
    const userId = await getUserId(ctx);

    // Check if already favorited
    const existing = await ctx.db
      .query('userFavoriteTalks')
      .withIndex('by_user_and_talk', (q) => q.eq('userId', userId).eq('talkId', args.talkId))
      .first();

    if (existing) {
      throw new Error('Talk already favorited');
    }

    return await ctx.db.insert('userFavoriteTalks', {
      talkId: args.talkId,
      userId: userId,
    });
  },
});

export const removeFavoriteTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const favorite = await ctx.db
      .query('userFavoriteTalks')
      .withIndex('by_user_and_talk', (q) => q.eq('userId', userId).eq('talkId', args.talkId))
      .first();

    if (!favorite) {
      throw new Error('Favorite not found');
    }

    await ctx.db.delete(favorite._id);

    return null;
  },
});

export const addFavoriteClip = mutation({
  args: {
    clipId: v.id('clips'),
  },
  returns: v.id('userFavoriteClips'),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    // Check if already favorited
    const existing = await ctx.db
      .query('userFavoriteClips')
      .withIndex('by_user_and_clip', (q) => q.eq('userId', userId).eq('clipId', args.clipId))
      .first();

    if (existing) {
      throw new Error('Clip already favorited');
    }

    return await ctx.db.insert('userFavoriteClips', {
      clipId: args.clipId,
      userId: userId,
    });
  },
});

export const removeFavoriteClip = mutation({
  args: {
    clipId: v.id('clips'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const favorite = await ctx.db
      .query('userFavoriteClips')
      .withIndex('by_user_and_clip', (q) => q.eq('userId', userId).eq('clipId', args.clipId))
      .first();

    if (!favorite) {
      throw new Error('Favorite not found');
    }

    await ctx.db.delete(favorite._id);

    return null;
  },
});

export const addFavoriteSpeaker = mutation({
  args: {
    speakerId: v.id('speakers'),
  },
  returns: v.id('userFavoriteSpeakers'),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    // Check if already favorited
    const existing = await ctx.db
      .query('userFavoriteSpeakers')
      .withIndex('by_user_and_speaker', (q) =>
        q.eq('userId', userId).eq('speakerId', args.speakerId),
      )
      .first();

    if (existing) {
      throw new Error('Speaker already favorited');
    }

    return await ctx.db.insert('userFavoriteSpeakers', {
      speakerId: args.speakerId,
      userId: userId,
    });
  },
});

export const removeFavoriteSpeaker = mutation({
  args: {
    speakerId: v.id('speakers'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const favorite = await ctx.db
      .query('userFavoriteSpeakers')
      .withIndex('by_user_and_speaker', (q) =>
        q.eq('userId', userId).eq('speakerId', args.speakerId),
      )
      .first();

    if (!favorite) {
      throw new Error('Favorite not found');
    }

    await ctx.db.delete(favorite._id);

    return null;
  },
});
