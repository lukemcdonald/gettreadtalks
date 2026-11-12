import type { AuthUser } from '@/services/auth/types';

import { describe, expect, it } from '@/test';

import {
  getCurrentUserQueryArgs,
  getCurrentUserState,
} from './get-current-user-state';

describe('getCurrentUserQueryArgs', () => {
  it('skips getCurrentUser when signed out', () => {
    expect(getCurrentUserQueryArgs(false)).toBe('skip');
  });

  it('queries getCurrentUser when signed in', () => {
    expect(getCurrentUserQueryArgs(true)).toEqual({});
  });
});

describe('getCurrentUserState', () => {
  const signedInUser = {
    email: 'user@example.com',
    name: 'Test User',
  } as AuthUser;

  it('treats a skipped signed-out query as ready', () => {
    expect(
      getCurrentUserState({
        data: undefined,
        isAuthenticated: false,
        isAuthLoading: false,
      })
    ).toEqual({
      data: null,
      isLoading: false,
    });
  });

  it('uses query data when signed in', () => {
    expect(
      getCurrentUserState({
        data: signedInUser,
        isAuthenticated: true,
        isAuthLoading: false,
      })
    ).toEqual({
      data: signedInUser,
      isLoading: false,
    });
  });

  it('trusts SSR initialData while auth is loading', () => {
    expect(
      getCurrentUserState({
        data: undefined,
        initialData: signedInUser,
        isAuthenticated: false,
        isAuthLoading: true,
      })
    ).toEqual({
      data: signedInUser,
      isLoading: false,
    });
  });
});
