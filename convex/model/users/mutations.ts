import type { MutationCtx } from '../../_generated/server';

import { Id } from '../../_generated/dataModel';
import { getUserId } from '../auth/queries';

/**
 * Add a talk to user favorites.
 *
 * @param ctx - Database context
 * @param args - Arguments containing talkId
 * @returns The ID of the created favorite record
 */
export async function addFavoriteTalk(
  ctx: MutationCtx,
  args: {
    talkId: Id<'talks'>;
  },
) {
  const userId = await getUserId(ctx);

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
}

/**
 * Remove a talk from user favorites.
 *
 * @param ctx - Database context
 * @param args - Arguments containing talkId
 * @returns null
 */
export async function removeFavoriteTalk(
  ctx: MutationCtx,
  args: {
    talkId: Id<'talks'>;
  },
) {
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
}

/**
 * Add a clip to user favorites.
 *
 * @param ctx - Database context
 * @param args - Arguments containing clipId
 * @returns The ID of the created favorite record
 */
export async function addFavoriteClip(
  ctx: MutationCtx,
  args: {
    clipId: Id<'clips'>;
  },
) {
  const userId = await getUserId(ctx);

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
}

/**
 * Remove a clip from user favorites.
 *
 * @param ctx - Database context
 * @param args - Arguments containing clipId
 * @returns null
 */
export async function removeFavoriteClip(
  ctx: MutationCtx,
  args: {
    clipId: Id<'clips'>;
  },
) {
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
}

/**
 * Add a speaker to user favorites.
 *
 * @param ctx - Database context
 * @param args - Arguments containing speakerId
 * @returns The ID of the created favorite record
 */
export async function addFavoriteSpeaker(
  ctx: MutationCtx,
  args: {
    speakerId: Id<'speakers'>;
  },
) {
  const userId = await getUserId(ctx);

  const existing = await ctx.db
    .query('userFavoriteSpeakers')
    .withIndex('by_user_and_speaker', (q) => q.eq('userId', userId).eq('speakerId', args.speakerId))
    .first();

  if (existing) {
    throw new Error('Speaker already favorited');
  }

  return await ctx.db.insert('userFavoriteSpeakers', {
    speakerId: args.speakerId,
    userId: userId,
  });
}

/**
 * Remove a speaker from user favorites.
 *
 * @param ctx - Database context
 * @param args - Arguments containing speakerId
 * @returns null
 */
export async function removeFavoriteSpeaker(
  ctx: MutationCtx,
  args: {
    speakerId: Id<'speakers'>;
  },
) {
  const userId = await getUserId(ctx);

  const favorite = await ctx.db
    .query('userFavoriteSpeakers')
    .withIndex('by_user_and_speaker', (q) => q.eq('userId', userId).eq('speakerId', args.speakerId))
    .first();

  if (!favorite) {
    throw new Error('Favorite not found');
  }

  await ctx.db.delete(favorite._id);

  return null;
}
