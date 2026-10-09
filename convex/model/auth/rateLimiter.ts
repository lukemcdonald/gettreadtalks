import { v } from 'convex/values';

import { internalMutation, mutation } from '../../_generated/server';
import { rateLimiter } from '../../lib/rateLimiter';

export const checkChangePassword = internalMutation({
  args: { key: v.string() },
  handler: async (ctx, { key }) =>
    await rateLimiter.limit(ctx, 'changePassword', { key }),
});

export const checkMcp = mutation({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const { ok, retryAfter } = await rateLimiter.limit(ctx, 'mcp', { key });

    return {
      ok,
      retryAfter: retryAfter ?? null,
    };
  },
  returns: v.object({
    ok: v.boolean(),
    retryAfter: v.union(v.number(), v.null()),
  }),
});

export const checkPasswordReset = internalMutation({
  args: { key: v.string() },
  handler: async (ctx, { key }) =>
    await rateLimiter.limit(ctx, 'passwordReset', { key }),
});

export const checkSignIn = internalMutation({
  args: { key: v.string() },
  handler: async (ctx, { key }) =>
    await rateLimiter.limit(ctx, 'signIn', { key }),
});

export const checkSignUp = internalMutation({
  args: { key: v.string() },
  handler: async (ctx, { key }) =>
    await rateLimiter.limit(ctx, 'signUp', { key }),
});
