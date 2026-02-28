'use client';

import type { User } from '@/services/auth/types';

import { useConvexAuth, useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

/**
 * Get the current authenticated user.
 *
 * Uses SSR data while client auth is syncing to prevent flash of incorrect state.
 *
 * @param initialData - Optional SSR user data to prevent layout shift
 * @returns { data, isLoading }
 */
export function useCurrentUser(initialData?: User | null) {
  const { isLoading: isAuthLoading } = useConvexAuth();
  const data = useQuery(api.users.getCurrentUser);

  // Trust SSR data until client-side auth is fully resolved:
  // 1. Auth is still syncing (isAuthLoading = true)
  // 2. Query hasn't returned yet (data = undefined)
  // Only show logged-out state when query explicitly returns null
  const isClientReady = !isAuthLoading && data !== undefined;
  const user = isClientReady ? (data ?? null) : (initialData ?? null);
  const isLoading = !isClientReady && initialData === undefined;

  return {
    data: user,
    isLoading,
  };
}
