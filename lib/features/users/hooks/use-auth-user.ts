'use client';

import type { User } from '@/lib/services/auth/types';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

/**
 * Get the current authenticated user.
 *
 * @param initialData - Optional SSR user data to prevent layout shift
 * @returns { data, isLoading }
 */
export function useAuthUser(initialData?: User) {
  const data = useQuery(api.users.getAuthUser);

  const user = data ?? initialData;
  const isLoading = data === undefined && initialData === undefined;

  return {
    // !Note: Maybe return user or currentUser or authUser?
    data: user,
    isLoading,
  };
}
