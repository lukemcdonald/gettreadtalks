import type { MutationCtx, QueryCtx } from '../../_generated/server';

import { authComponent } from '../../auth';
import { throwAuthRequired } from '../../lib/errors';

/**
 * Get the current authenticated user.
 *
 * @param ctx - Query or Mutation context
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  return await authComponent.safeGetAuthUser(ctx);
}

/**
 * Get user ID from authenticated user.
 *
 * @param ctx - Query or Mutation context
 * @returns User ID string
 * @throws Error if not authenticated
 */
export async function getUserId(ctx: QueryCtx | MutationCtx) {
  const user = await requireAuth(ctx);
  return user._id;
}

/**
 * Require authentication and return the current user.
 *
 * @param ctx - Query or Mutation context
 * @returns User object
 * @throws Error if not authenticated
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const user = await getCurrentUser(ctx);

  if (!user) {
    throwAuthRequired();
  }

  return user;
}
