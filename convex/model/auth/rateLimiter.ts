import { v } from 'convex/values';
import { sha256 } from 'js-sha256';

import { internalMutation, mutation } from '../../_generated/server';
import { rateLimiter } from '../../lib/rateLimiter';

function expectedMcpToken() {
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    return;
  }

  return sha256(`mcp-limiter:${secret}`);
}

export const checkChangePassword = internalMutation({
  args: { key: v.string() },
  handler: async (ctx, { key }) =>
    await rateLimiter.limit(ctx, 'changePassword', { key }),
});

export const checkMcp = mutation({
  args: {
    key: v.string(),
    token: v.string(),
  },
  handler: async (ctx, { key, token }) => {
    if (token !== expectedMcpToken()) {
      return {
        ok: false,
        retryAfter: 60_000,
      };
    }

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
