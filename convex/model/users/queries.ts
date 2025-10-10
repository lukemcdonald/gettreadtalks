import type { QueryCtx } from '../../_generated/server';

import { getCurrentUser } from '../auth/queries';
import type { ListUserFavoritesArgs } from './types';

/**
 * List all user favorites.
 *
 * @param ctx - Database context
 * @param args - Query arguments with defaults
 * @returns Object with clips, speakers, and talks favorites
 */
export async function listUserFavorites(ctx: QueryCtx, args: ListUserFavoritesArgs) {
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

  return await getUserFavorites(ctx, userId, limit);
}

/**
 * Get user favorites by clip.
 *
 * @param ctx - Database context
 * @param userId - User ID
 * @param limit - Maximum number of favorites
 * @returns Array of favorite records
 */
export async function getUserFavoriteClips(ctx: QueryCtx, userId: string, limit: number) {
  return await ctx.db
    .query('userFavoriteClips')
    .withIndex('by_user_and_clip', (q) => q.eq('userId', userId))
    .take(limit);
}

/**
 * Get user favorite speakers.
 *
 * @param ctx - Database context
 * @param userId - User ID
 * @param limit - Maximum number of favorites
 * @returns Array of favorite speakers
 */
export async function getUserFavoriteSpeakers(ctx: QueryCtx, userId: string, limit: number) {
  return await ctx.db
    .query('userFavoriteSpeakers')
    .withIndex('by_user_and_speaker', (q) => q.eq('userId', userId))
    .take(limit);
}

/**
 * Get user favorite talks.
 *
 * @param ctx - Database context
 * @param userId - User ID
 * @param limit - Maximum number of favorites
 * @returns Array of favorite talks
 */
export async function getUserFavoriteTalks(ctx: QueryCtx, userId: string, limit: number) {
  return await ctx.db
    .query('userFavoriteTalks')
    .withIndex('by_user_and_talk', (q) => q.eq('userId', userId))
    .take(limit);
}

/**
 * Get all user favorites.
 *
 * @param ctx - Database context
 * @param userId - User ID
 * @param limit - Maximum number of favorites per type
 * @returns Object with clips, speakers, and talks favorites
 */
export async function getUserFavorites(ctx: QueryCtx, userId: string, limit: number) {
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
}
