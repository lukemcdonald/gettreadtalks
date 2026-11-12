'use client';

import type { User } from '@/services/auth/types';

import { useConvexAuth, useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useSessionCookiePresence } from '@/services/auth/session-presence-store';

interface CurrentUserState {
  data: User | null;
  isLoading: boolean;
}

export function getCurrentUserState({
  hasSessionCookie,
  initialData,
  isAuthLoading,
  isAuthenticated,
  queryData,
}: {
  hasSessionCookie: boolean | null;
  initialData?: User | null;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  queryData: User | undefined;
}): CurrentUserState {
  if (hasSessionCookie === false) {
    return {
      data: null,
      isLoading: false,
    };
  }

  if (hasSessionCookie !== true) {
    return {
      data: initialData ?? null,
      isLoading: initialData === undefined,
    };
  }

  if (!isAuthenticated) {
    return {
      data: initialData ?? null,
      isLoading: isAuthLoading && initialData === undefined,
    };
  }

  const isClientReady = !isAuthLoading && queryData !== undefined;

  return {
    data: isClientReady ? (queryData ?? null) : (initialData ?? null),
    isLoading: !isClientReady && initialData === undefined,
  };
}

/**
 * Get the current authenticated user.
 *
 * Uses SSR data while client auth is syncing to prevent flash of incorrect state.
 *
 * @param initialData - Optional SSR user data to prevent layout shift
 * @returns Current user data (`data`) and whether client auth is still resolving (`isLoading`)
 */
export function useCurrentUser(initialData?: User | null) {
  const hasSessionCookie = useSessionCookiePresence();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const queryData = useQuery(
    api.users.getCurrentUser,
    hasSessionCookie === true ? {} : 'skip'
  );

  return getCurrentUserState({
    hasSessionCookie,
    initialData,
    isAuthLoading,
    isAuthenticated,
    queryData,
  });
}
