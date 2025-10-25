import type { QueryCtx } from '../../_generated/server';

/**
 * Get user's favorite clips.
 *
 * @param ctx - Database context
 * @param userId - User ID
 * @param limit - Maximum number of favorites
 * @returns Array of favorite clip records
 */
export async function getUserFavoriteClips(ctx: QueryCtx, userId: string, limit: number) {
  return await ctx.db
    .query('userFavoriteClips')
    .withIndex('by_userId_and_clipId', (q) => q.eq('userId', userId))
    .take(limit);
}

/**
 * Get user's favorite speakers.
 *
 * @param ctx - Database context
 * @param userId - User ID
 * @param limit - Maximum number of favorites
 * @returns Array of favorite speaker records
 */
export async function getUserFavoriteSpeakers(ctx: QueryCtx, userId: string, limit: number) {
  return await ctx.db
    .query('userFavoriteSpeakers')
    .withIndex('by_userId_and_speakerId', (q) => q.eq('userId', userId))
    .take(limit);
}

/**
 * Get user's favorite talks.
 *
 * @param ctx - Database context
 * @param userId - User ID
 * @param limit - Maximum number of favorites
 * @returns Array of favorite talk records
 */
export async function getUserFavoriteTalks(ctx: QueryCtx, userId: string, limit: number) {
  return await ctx.db
    .query('userFavoriteTalks')
    .withIndex('by_userId_and_talkId', (q) => q.eq('userId', userId))
    .take(limit);
}
