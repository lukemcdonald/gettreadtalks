import type { MutationCtx, QueryCtx } from '../../_generated/server';
import type { AdminUser, User } from './types';

import { throwForbidden } from '../../lib/errors';
import { requireAuth } from './utils';

export type UserRole = 'admin' | 'user';

/**
 * Check if a user has admin role.
 * The role field is added by Better Auth admin plugin at runtime.
 *
 * @param user - User object that may have role field
 * @returns True if user is an admin, false otherwise
 */
export function isAdmin(user: User): boolean {
  return user?.role === 'admin';
}

/**
 * Require admin access and return the current user.
 *
 * @param ctx - Query or Mutation context
 * @returns Admin user object with guaranteed admin role
 * @throws Error if not authenticated or not an admin
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx): Promise<AdminUser> {
  const user = await requireAuth(ctx);

  if (!isAdmin(user)) {
    throwForbidden('Admin access required');
  }

  return user as AdminUser;
}
