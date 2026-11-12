'use client';

import type { User } from '@/services/auth/types';

import { useConvexAuth, useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

/**
 * Live user query. Skip until Convex auth is ready; trust SSR `initialData`
 * while auth is loading so a signed-in refresh does not flash signed-out.
 */
export function useCurrentUser(initialData?: User | null) {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const data = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : 'skip'
  );

  // A skipped query stays `undefined`. Signed-out visitors are ready once
  // auth has finished; only signed-in visitors wait for query data.
  const isClientReady =
    !isAuthLoading && (!isAuthenticated || data !== undefined);
  const user = isClientReady ? (data ?? null) : (initialData ?? null);
  const isLoading = !isClientReady && initialData === undefined;

  return {
    data: user,
    isLoading,
  };
}
