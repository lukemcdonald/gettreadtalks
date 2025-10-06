import type { DatabaseReader } from '../_generated/server';
import type { Doc } from '../_generated/dataModel';

/**
 * Get user favorites by type
 * @param ctx - Database context
 * @param userId - User ID
 * @param favoriteType - Type of favorite ('clips', 'speakers', 'talks')
 * @param limit - Maximum number of favorites
 * @returns Array of favorite records
 */
export async function getUserFavoriteClips(
  ctx: DatabaseReader,
  userId: string,
  limit: number,
): Promise<Doc<'userFavoriteClips'>[]> {
  return await ctx
    .query('userFavoriteClips')
    .withIndex('by_user_and_clip', (q) => q.eq('userId', userId))
    .take(limit);
}

export async function getUserFavoriteSpeakers(
  ctx: DatabaseReader,
  userId: string,
  limit: number,
): Promise<Doc<'userFavoriteSpeakers'>[]> {
  return await ctx
    .query('userFavoriteSpeakers')
    .withIndex('by_user_and_speaker', (q) => q.eq('userId', userId))
    .take(limit);
}

export async function getUserFavoriteTalks(
  ctx: DatabaseReader,
  userId: string,
  limit: number,
): Promise<Doc<'userFavoriteTalks'>[]> {
  return await ctx
    .query('userFavoriteTalks')
    .withIndex('by_user_and_talk', (q) => q.eq('userId', userId))
    .take(limit);
}

/**
 * Get all user favorites
 * @param ctx - Database context
 * @param userId - User ID
 * @param limit - Maximum number of favorites per type
 * @returns Object with clips, speakers, and talks favorites
 */
export async function getAllUserFavorites(
  ctx: DatabaseReader,
  userId: string,
  limit: number,
): Promise<{
  clips: Doc<'userFavoriteClips'>[];
  speakers: Doc<'userFavoriteSpeakers'>[];
  talks: Doc<'userFavoriteTalks'>[];
}> {
  const [clips, speakers, talks] = await Promise.all([
    getUserFavoriteClips(ctx, userId, limit),
    getUserFavoriteSpeakers(ctx, userId, limit),
    getUserFavoriteTalks(ctx, userId, limit),
  ]);

  return { clips, speakers, talks };
}
