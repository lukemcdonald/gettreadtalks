import type { MutationCtx, QueryCtx } from '../../_generated/server';
import type { StatusType } from '../../lib/validators/shared';
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
export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

/**
 * Check if a user can view content with the given status.
 * Admins can view all content, non-admin users can only view published content.
 *
 * @param user - User object (can be null for unauthenticated users)
 * @param status - Content status to check
 * @returns True if user can view the content, false otherwise
 */
export function canViewContent(user: User | null, status: StatusType): boolean {
  return isAdmin(user) || status === 'published';
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
