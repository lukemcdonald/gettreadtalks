'use client';

import { useCurrentUser } from './use-current-user';

/**
 * Returns whether the current user is authenticated.
 * Use this for components that only need to know auth state,
 * not user data.
 */
export function useIsAuthenticated(): boolean {
  const { data: user } = useCurrentUser();
  return user !== null;
}
