import type { MutationCtx, QueryCtx } from '../../_generated/server';
import type { StatusType } from '../../lib/types';
import type { AdminUser, User } from './types';

import { throwForbidden } from '../../lib/errors';
import { requireAuth } from './utils';

export type UserRole = 'admin' | 'user';

/**
 * Check if a user has admin role.
 * The role field is added by Better Auth admin plugin at runtime.
 */
export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

/**
 * Check if a user can view content with the given status.
 * Admins can view all content, non-admin users can only view published content.
 */
export function canViewContent(user: User | null, status: StatusType): boolean {
  return isAdmin(user) || status === 'published';
}

/**
 * Require admin access and return the current user.
 * Throws error if not authenticated or not an admin.
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx): Promise<AdminUser> {
  const user = await requireAuth(ctx);

  if (!isAdmin(user)) {
    throwForbidden('Admin access required');
  }

  return user as AdminUser;
}
