import { v } from 'convex/values';

import { internalMutation } from '../../_generated/server';
import { rateLimiter } from '../../lib/rateLimiter';

export const checkSignIn = internalMutation({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    return await rateLimiter.limit(ctx, 'signIn', { key });
  },
});
