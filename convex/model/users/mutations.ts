import { v } from 'convex/values';

import { internalMutation, mutation } from '../../_generated/server';
import { authComponent, createAuth } from '../../auth';
import { throwNotFound, throwValidationError } from '../../lib/errors';
import { requireAdmin } from '../auth/roles';
import { getUserId } from '../auth/utils';
import { userRole } from './validators';

/**
 * Add a clip to user favorites.
 *
 * @param ctx - Database context
 * @param args - Arguments containing clipId
 * @returns The ID of the created favorite record
 */
export const favoriteClip = mutation({
  args: {
    clipId: v.id('clips'),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const existing = await ctx.db
      .query('userFavoriteClips')
      .withIndex('by_userId_and_clipId', (q) => q.eq('userId', userId).eq('clipId', args.clipId))
      .first();

    if (existing) {
      throwValidationError('Clip already favorited');
    }

    return await ctx.db.insert('userFavoriteClips', {
      clipId: args.clipId,
      userId,
    });
  },
  returns: v.id('userFavoriteClips'),
});

/**
 * Add a speaker to user favorites.
 *
 * @param ctx - Database context
 * @param args - Arguments containing speakerId
 * @returns The ID of the created favorite record
 */
export const favoriteSpeaker = mutation({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const existing = await ctx.db
      .query('userFavoriteSpeakers')
      .withIndex('by_userId_and_speakerId', (q) =>
        q.eq('userId', userId).eq('speakerId', args.speakerId),
      )
      .first();

    if (existing) {
      throwValidationError('Speaker already favorited');
    }

    return await ctx.db.insert('userFavoriteSpeakers', {
      speakerId: args.speakerId,
      userId,
    });
  },
  returns: v.id('userFavoriteSpeakers'),
});

/**
 * Add a talk to user favorites.
 *
 * @param ctx - Database context
 * @param args - Arguments containing talkId
 * @returns The ID of the created favorite record
 */
export const favoriteTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const existing = await ctx.db
      .query('userFavoriteTalks')
      .withIndex('by_userId_and_talkId', (q) => q.eq('userId', userId).eq('talkId', args.talkId))
      .first();

    if (existing) {
      throwValidationError('Talk already favorited');
    }

    return await ctx.db.insert('userFavoriteTalks', {
      talkId: args.talkId,
      userId,
    });
  },
  returns: v.id('userFavoriteTalks'),
});

/**
 * Mark a talk as finished for the user.
 *
 * @param ctx - Database context
 * @param args - Arguments containing talkId
 * @returns The ID of the created finished record
 */
export const finishTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const existing = await ctx.db
      .query('userFinishedTalks')
      .withIndex('by_userId_and_talkId', (q) => q.eq('userId', userId).eq('talkId', args.talkId))
      .first();

    if (existing) {
      throwValidationError('Talk already marked as finished');
    }

    return await ctx.db.insert('userFinishedTalks', {
      talkId: args.talkId,
      userId,
    });
  },
  returns: v.id('userFinishedTalks'),
});

/**
 * Remove a clip from user favorites.
 *
 * @param ctx - Database context
 * @param args - Arguments containing clipId
 * @returns null
 */
export const unfavoriteClip = mutation({
  args: {
    clipId: v.id('clips'),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const favorite = await ctx.db
      .query('userFavoriteClips')
      .withIndex('by_userId_and_clipId', (q) => q.eq('userId', userId).eq('clipId', args.clipId))
      .first();

    if (!favorite) {
      throwNotFound('Favorite not found', { resource: 'userFavoriteClips' });
    }

    await ctx.db.delete(favorite._id);

    return null;
  },
  returns: v.null(),
});

/**
 * Remove a speaker from user favorites.
 *
 * @param ctx - Database context
 * @param args - Arguments containing speakerId
 * @returns null
 */
export const unfavoriteSpeaker = mutation({
  args: {
    speakerId: v.id('speakers'),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const favorite = await ctx.db
      .query('userFavoriteSpeakers')
      .withIndex('by_userId_and_speakerId', (q) =>
        q.eq('userId', userId).eq('speakerId', args.speakerId),
      )
      .first();

    if (!favorite) {
      throwNotFound('Favorite not found', { resource: 'userFavoriteClips' });
    }

    await ctx.db.delete(favorite._id);

    return null;
  },
  returns: v.null(),
});

/**
 * Remove a talk from user favorites.
 *
 * @param ctx - Database context
 * @param args - Arguments containing talkId
 * @returns null
 */
export const unfavoriteTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const favorite = await ctx.db
      .query('userFavoriteTalks')
      .withIndex('by_userId_and_talkId', (q) => q.eq('userId', userId).eq('talkId', args.talkId))
      .first();

    if (!favorite) {
      throwNotFound('Favorite not found', { resource: 'userFavoriteClips' });
    }

    await ctx.db.delete(favorite._id);

    return null;
  },
  returns: v.null(),
});

/**
 * Unmark a talk as finished for the user.
 *
 * @param ctx - Database context
 * @param args - Arguments containing talkId
 * @returns null
 */
export const unfinishTalk = mutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const finished = await ctx.db
      .query('userFinishedTalks')
      .withIndex('by_userId_and_talkId', (q) => q.eq('userId', userId).eq('talkId', args.talkId))
      .first();

    if (!finished) {
      throwNotFound('Finished talk not found', { resource: 'userFinishedTalks' });
    }

    await ctx.db.delete(finished._id);

    return null;
  },
  returns: v.null(),
});

/**
 * Update the user's password.
 *
 * @param ctx - Database context
 * @param args - Arguments containing current password and new password
 * @returns null
 */
export const updatePassword = mutation({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    await createAuth(ctx).api.changePassword({
      body: {
        currentPassword: args.currentPassword,
        newPassword: args.newPassword,
      },
      headers: await authComponent.getHeaders(ctx),
    });

    return null;
  },
  returns: v.null(),
});

/**
 * Set a user's role (internal - no auth required).
 *
 * Use this to set the first admin or manage roles programmatically.
 * Can be called from Convex Dashboard or CLI:
 * - Dashboard: Functions → internal.model.users.mutations.setUserRoleInternal
 * - CLI: npx convex run internal.model.users.mutations.setUserRoleInternal '{"userId":"...","role":"admin"}'
 */
export const setUserRoleInternal = internalMutation({
  args: {
    role: userRole,
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await createAuth(ctx).api.setRole({
      body: {
        role: args.role,
        userId: args.userId,
      },
      headers: {},
    });

    return args.userId;
  },
  returns: v.string(),
});

/**
 * Set a user's role (admin only).
 */
export const setUserRole = mutation({
  args: {
    role: userRole,
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    await createAuth(ctx).api.setRole({
      body: {
        role: args.role,
        userId: args.userId,
      },
      headers: await authComponent.getHeaders(ctx),
    });

    return args.userId;
  },
  returns: v.string(),
});
