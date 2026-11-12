'use client';

import type { User } from '@/services/auth/types';

import { useConvexAuth, useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

import {
  getCurrentUserQueryArgs,
  getCurrentUserState,
} from './get-current-user-state';

/**
 * Live user query. Skip until Convex auth is ready; trust SSR `initialData`
 * while auth is loading so a signed-in refresh does not flash signed-out.
 */
export function useCurrentUser(initialData?: User | null) {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const data = useQuery(
    api.users.getCurrentUser,
    getCurrentUserQueryArgs(isAuthenticated)
  );

  return getCurrentUserState({
    data,
    initialData,
    isAuthenticated,
    isAuthLoading,
  });
}
