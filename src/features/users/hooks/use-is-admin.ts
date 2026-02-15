'use client';

import { isAdmin } from '@/services/auth/utils';
import { useCurrentUser } from './use-current-user';

/**
 * Returns whether the current user has admin role.
 * Use this instead of reading user.role directly so components
 * express what they need, not how auth is structured.
 */
export function useIsAdmin(): boolean {
  const { data: user } = useCurrentUser();
  return isAdmin(user);
}
