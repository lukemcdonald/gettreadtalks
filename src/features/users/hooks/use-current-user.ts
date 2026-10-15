'use client';

import type { User } from '@/services/auth/types';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

/**
 * Get the current authenticated user.
 *
 * Uses SSR data until the live query resolves so sibling Convex islands can
 * share one client without ConvexProviderWithAuth.
 *
 * @param initialData - Optional SSR user data to prevent layout shift
 * @returns Current user data (`data`) and whether the live query is unresolved (`isLoading`)
 */
export function useCurrentUser(initialData?: User | null) {
  const data = useQuery(api.users.getCurrentUser);
  const isClientReady = data !== undefined;
  const user = isClientReady ? (data ?? null) : (initialData ?? null);
  const isLoading = !isClientReady && initialData === undefined;

  return {
    data: user,
    isLoading,
  };
}
