import type { MutationCtx, QueryCtx } from '../../_generated/server';
import type { User } from './types';

import { authComponent } from '../../auth';

/**
 * Get the current authenticated user identity.
 *
 * @param ctx - Query context
 * @returns User identity object or null if not authenticated
 */
export const getAuthUser = async (ctx: QueryCtx) => authComponent.safeGetAuthUser(ctx);

/**
 * Get the current authenticated user.
 *
 * @param ctx - Query or Mutation context
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx): Promise<User | null> {
  const user = await getAuthUser(ctx);

  if (!user) {
    return null;
  }

  return user as User;
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
export async function requireAuth(ctx: QueryCtx | MutationCtx): Promise<User> {
  const user = await getCurrentUser(ctx);

  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
}
