import type { AuthUser } from '@/services/auth/types';

import { describe, expect, it } from '@/test';

import { getCurrentUserState } from './use-current-user';

const user = {
  email: 'user@example.com',
  image: null,
  name: 'Test User',
  role: 'user',
} as AuthUser;

describe('getCurrentUserState', () => {
  it('skips signed-in state when there is no session cookie', () => {
    expect(
      getCurrentUserState({
        hasSessionCookie: false,
        initialData: user,
        isAuthLoading: false,
        isAuthenticated: false,
        queryData: user,
      })
    ).toEqual({
      data: null,
      isLoading: false,
    });
  });

  it('uses the server user until session cookie presence is known', () => {
    expect(
      getCurrentUserState({
        hasSessionCookie: null,
        initialData: user,
        isAuthLoading: false,
        isAuthenticated: false,
        queryData: undefined,
      })
    ).toEqual({
      data: user,
      isLoading: false,
    });
  });

  it('keeps the server user while a session cookie is present and client auth is syncing', () => {
    expect(
      getCurrentUserState({
        hasSessionCookie: true,
        initialData: user,
        isAuthLoading: true,
        isAuthenticated: false,
        queryData: undefined,
      })
    ).toEqual({
      data: user,
      isLoading: false,
    });
  });

  it('keeps the server user until Convex auth is ready', () => {
    expect(
      getCurrentUserState({
        hasSessionCookie: true,
        initialData: user,
        isAuthLoading: false,
        isAuthenticated: false,
        queryData: null,
      })
    ).toEqual({
      data: user,
      isLoading: false,
    });
  });
});
