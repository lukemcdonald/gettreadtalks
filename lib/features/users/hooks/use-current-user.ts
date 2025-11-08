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
export function useCurrentUser(initialData?: User) {
  const data = useQuery(api.users.getCurrentUser);

  const user = data ?? initialData;
  const isLoading = data === undefined && initialData === undefined;

  return {
    data: user,
    isLoading,
  };
}
