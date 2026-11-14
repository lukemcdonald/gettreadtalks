import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { loadCurrentUser } from '../auth/helpers';
import {
  listUserFavoriteClips,
  listUserFavoriteSpeakers,
  listUserFavoriteTalks,
  listUserFinishedTalks as listFinishedTalksForUser,
} from './helpers';

/**
 * Get the current authenticated user. Returns null if not authenticated.
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => await loadCurrentUser(ctx),
  returns: v.nullable(v.any()),
});

/**
 * Check if user has favorited a speaker.
 */
export const isSpeakerFavorited = query({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    const user = await loadCurrentUser(ctx);

    if (!user) {
      return false;
    }

    const favorite = await ctx.db
      .query('userFavoriteSpeakers')
      .withIndex('by_userId_and_speakerId', (q) =>
        q.eq('userId', user._id).eq('speakerId', args.speakerId)
      )
      .first();

    return favorite !== null;
  },
  returns: v.boolean(),
});

/**
 * Check if user has favorited a talk.
 */
export const isTalkFavorited = query({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    const user = await loadCurrentUser(ctx);

    if (!user) {
      return false;
    }

    const favorite = await ctx.db
      .query('userFavoriteTalks')
      .withIndex('by_userId_and_talkId', (q) =>
        q.eq('userId', user._id).eq('talkId', args.talkId)
      )
      .first();

    return favorite !== null;
  },
  returns: v.boolean(),
});

/**
 * Check if user has finished a talk.
 */
export const isTalkFinished = query({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    const user = await loadCurrentUser(ctx);

    if (!user) {
      return false;
    }

    const finished = await ctx.db
      .query('userFinishedTalks')
      .withIndex('by_userId_and_talkId', (q) =>
        q.eq('userId', user._id).eq('talkId', args.talkId)
      )
      .first();

    return finished !== null;
  },
  returns: v.boolean(),
});

/**
 * List all user favorites. Returns object with clips, speakers, and talks favorites.
 */
export const listUserFavorites = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await loadCurrentUser(ctx);

    if (!user) {
      return {
        clips: [],
        speakers: [],
        talks: [],
      };
    }

    const userId = user._id;
    const limit = args.limit ?? 100;

    const [clips, speakers, talks] = await Promise.all([
      listUserFavoriteClips(ctx, {
        limit,
        userId,
      }),
      listUserFavoriteSpeakers(ctx, {
        limit,
        userId,
      }),
      listUserFavoriteTalks(ctx, {
        limit,
        userId,
      }),
    ]);

    return {
      clips,
      speakers,
      talks,
    };
  },
  returns: v.object({
    clips: v.array(v.any()),
    speakers: v.array(v.any()),
    talks: v.array(v.any()),
  }),
});

/**
 * List all user finished talks with talk and speaker data.
 */
export const listUserFinishedTalks = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await loadCurrentUser(ctx);

    if (!user) {
      return [];
    }

    const limit = args.limit ?? 100;

    return await listFinishedTalksForUser(ctx, {
      limit,
      userId: user._id,
    });
  },
  returns: v.array(v.any()),
});
