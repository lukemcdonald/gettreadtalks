import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { getAuthUser } from '../auth/utils';
import { getUserFavoriteClips, getUserFavoriteSpeakers, getUserFavoriteTalks } from './utils';

/**
 * Get the current authenticated user.
 *
 * @param ctx - Query context
 * @returns User object or null if not authenticated
 */
export const getUser = query({
  args: {},
  handler: async (ctx) => {
    return await getAuthUser(ctx);
  },
  returns: v.union(v.any(), v.null()),
});

/**
 * Check if user has favorited a clip.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns True if favorited, false otherwise
 */
export const isClipFavorited = query({
  args: {
    clipId: v.id('clips'),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    if (!user) {
      return false;
    }

    const favorite = await ctx.db
      .query('userFavoriteClips')
      .withIndex('by_userId_and_clipId', (q) => q.eq('userId', user._id).eq('clipId', args.clipId))
      .first();

    return favorite !== null;
  },
  returns: v.boolean(),
});

/**
 * Check if user has favorited a speaker.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns True if favorited, false otherwise
 */
export const isSpeakerFavorited = query({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    if (!user) {
      return false;
    }

    const favorite = await ctx.db
      .query('userFavoriteSpeakers')
      .withIndex('by_userId_and_speakerId', (q) =>
        q.eq('userId', user._id).eq('speakerId', args.speakerId),
      )
      .first();

    return favorite !== null;
  },
  returns: v.boolean(),
});

/**
 * Check if user has favorited a talk.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns True if favorited, false otherwise
 */
export const isTalkFavorited = query({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    if (!user) {
      return false;
    }

    const favorite = await ctx.db
      .query('userFavoriteTalks')
      .withIndex('by_userId_and_talkId', (q) => q.eq('userId', user._id).eq('talkId', args.talkId))
      .first();

    return favorite !== null;
  },
  returns: v.boolean(),
});

/**
 * Check if user has finished a talk.
 *
 * @param ctx - Database context
 * @param args - Query arguments
 * @returns True if finished, false otherwise
 */
export const isTalkFinished = query({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    if (!user) {
      return false;
    }

    const finished = await ctx.db
      .query('userFinishedTalks')
      .withIndex('by_userId_and_talkId', (q) => q.eq('userId', user._id).eq('talkId', args.talkId))
      .first();

    return finished !== null;
  },
  returns: v.boolean(),
});

/**
 * List all user favorites.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Object with clips, speakers, and talks favorites
 */
export const listUserFavorites = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

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
      getUserFavoriteClips(ctx, userId, limit),
      getUserFavoriteSpeakers(ctx, userId, limit),
      getUserFavoriteTalks(ctx, userId, limit),
    ]);

    return {
      clips,
      speakers,
      talks,
    };

    // return await getUserFavorites(ctx, userId, limit);
  },
  returns: v.object({
    clips: v.array(v.any()),
    speakers: v.array(v.any()),
    talks: v.array(v.any()),
  }),
});

/**
 * List all user finished talks.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Array of finished talk records
 */
export const listUserFinishedTalks = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    if (!user) {
      return [];
    }

    const limit = args.limit ?? 100;

    return await ctx.db
      .query('userFinishedTalks')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .order('desc')
      .take(limit);
  },
  returns: v.array(v.any()),
});
