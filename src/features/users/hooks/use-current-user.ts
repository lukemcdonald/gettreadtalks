'use client';

import type { User } from '@/services/auth/types';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

/**
 * Get the current authenticated user.
 *
 * @param initialData - Optional SSR user data to prevent layout shift
 * @returns { data, isLoading }
 */
export function useCurrentUser(initialData?: User) {
  const data = useQuery(api.users.getCurrentUser);

  // Only use initialData when query hasn't loaded yet (undefined)
  // Once query has loaded (null or user object), use that value
  const user = data === undefined ? initialData : data;
  const isLoading = data === undefined && initialData === undefined;

  return {
    data: user,
    isLoading,
  };
}
