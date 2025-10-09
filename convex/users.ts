import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { authComponent, createAuth } from './auth';
import { updatePasswordArgs } from './model/users/validators';

// ============================================
// MUTATIONS
// ============================================

export const updatePassword = mutation({
  args: updatePasswordArgs,
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
