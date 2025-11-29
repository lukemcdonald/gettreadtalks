'use client';

import type { User } from '@/services/auth/types';

import { useCurrentUser } from './use-current-user';

/**
 * Check if the current user has admin role.
 * The role field is added by Better Auth admin plugin at runtime.
 *
 * @param initialData - Optional SSR user data to prevent layout shift
 * @returns { isAdmin, isLoading }
 */
export function useIsAdmin(initialData?: User) {
  const { data: user, isLoading } = useCurrentUser(initialData);

  return {
    isAdmin: (user as { role?: string } | null)?.role === 'admin',
    isLoading,
  };
}
