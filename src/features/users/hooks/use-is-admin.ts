'use client';

import type { User } from '@/services/auth/types';

import { isAdmin } from '@/services/auth/utils';
import { useCurrentUser } from './use-current-user';

/**
 * Check if the current user has admin role.
 *
 * @param initialData - Optional SSR user data to prevent layout shift
 * @returns { isAdmin, isLoading }
 */
export function useIsAdmin(initialData?: User) {
  const { data: user, isLoading } = useCurrentUser(initialData);

  return {
    isAdmin: isAdmin(user),
    isLoading,
  };
}
