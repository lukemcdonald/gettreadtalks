import type { MutationCtx } from '../../_generated/server';

import { Id } from '../../_generated/dataModel';
import { getUserId } from '../auth/queries';

/**
 * Add a clip to user favorites.
 *
 * @param ctx - Database context
 * @param args - Arguments containing clipId
 * @returns The ID of the created favorite record
 */
export async function favoriteClip(
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
 * Add a speaker to user favorites.
 *
 * @param ctx - Database context
 * @param args - Arguments containing speakerId
 * @returns The ID of the created favorite record
 */
export async function favoriteSpeaker(
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
 * Add a talk to user favorites.
 *
 * @param ctx - Database context
 * @param args - Arguments containing talkId
 * @returns The ID of the created favorite record
 */
export async function favoriteTalk(
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
 * Mark a talk as finished for the user.
 *
 * @param ctx - Database context
 * @param args - Arguments containing talkId
 * @returns The ID of the created finished record
 */
export async function finishTalk(
  ctx: MutationCtx,
  args: {
    talkId: Id<'talks'>;
  },
) {
  const userId = await getUserId(ctx);

  const existing = await ctx.db
    .query('userFinishedTalks')
    .withIndex('by_user_and_talk', (q) => q.eq('userId', userId).eq('talkId', args.talkId))
    .first();

  if (existing) {
    throw new Error('Talk already marked as finished');
  }

  return await ctx.db.insert('userFinishedTalks', {
    talkId: args.talkId,
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
export async function unfavoriteClip(
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
 * Remove a speaker from user favorites.
 *
 * @param ctx - Database context
 * @param args - Arguments containing speakerId
 * @returns null
 */
export async function unfavoriteSpeaker(
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

/**
 * Remove a talk from user favorites.
 *
 * @param ctx - Database context
 * @param args - Arguments containing talkId
 * @returns null
 */
export async function unfavoriteTalk(
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
 * Unmark a talk as finished for the user.
 *
 * @param ctx - Database context
 * @param args - Arguments containing talkId
 * @returns null
 */
export async function unfinishTalk(
  ctx: MutationCtx,
  args: {
    talkId: Id<'talks'>;
  },
) {
  const userId = await getUserId(ctx);

  const finished = await ctx.db
    .query('userFinishedTalks')
    .withIndex('by_user_and_talk', (q) => q.eq('userId', userId).eq('talkId', args.talkId))
    .first();

  if (!finished) {
    throw new Error('Finished talk not found');
  }

  await ctx.db.delete(finished._id);

  return null;
}
