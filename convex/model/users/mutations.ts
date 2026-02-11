import { v } from 'convex/values';

import { internalMutation, mutation } from '../../_generated/server';
import { authComponent, createAuth } from '../../auth';
import { throwNotFound, throwValidationError } from '../../lib/errors';
import { requireAdmin } from '../auth/roles';
import { getUserId } from '../auth/utils';
import { userRole } from './validators';

/**
 * Add a clip to user favorites.
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
      throwNotFound('Favorite not found', { resource: 'userFavoriteSpeakers' });
    }

    await ctx.db.delete(favorite._id);

    return null;
  },
  returns: v.null(),
});

/**
 * Remove a talk from user favorites.
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
      throwNotFound('Favorite not found', { resource: 'userFavoriteTalks' });
    }

    await ctx.db.delete(favorite._id);

    return null;
  },
  returns: v.null(),
});

/**
 * Unmark a talk as finished for the user.
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
 * Update the user's display name.
 */
export const updateUserProfile = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await createAuth(ctx).api.updateUser({
      body: {
        name: args.name,
      },
      headers: await authComponent.getHeaders(ctx),
    });

    return null;
  },
  returns: v.null(),
});

/**
 * Delete the user's account.
 */
export const deleteUser = mutation({
  args: {
    password: v.string(),
  },
  handler: async (ctx, args) => {
    await createAuth(ctx).api.deleteUser({
      body: {
        callbackURL: '/',
        password: args.password,
      },
      headers: await authComponent.getHeaders(ctx),
    });

    return null;
  },
  returns: v.null(),
});

/**
 * Update the user's password.
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
