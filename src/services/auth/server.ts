'use server';

import 'server-only';

import type { Route } from 'next';
import type { AdminUser } from '@/services/auth/types';

import { cache } from 'react';
import { getToken } from '@convex-dev/better-auth/nextjs';
import { fetchQuery } from 'convex/nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { createAuth } from '@/convex/auth';
import { isAdmin } from '@/services/auth/utils';

/**
 * Get the authentication token for the current user.
 * Wrapped with React's cache() to ensure the token is only retrieved once per request,
 * even if called multiple times. This reduces redundant cookie reads and improves performance.
 *
 * @returns Authentication token or null if not authenticated
 */
export const getAuthToken = cache(async () => {
  // Always access cookies to satisfy Next.js 16 Turbopack requirements
  // This ensures dynamic rendering before Math.random() usage in betterAuth
  // Avoids the "used Math.random() before accessing Request data" error on page and builds.
  await cookies();
  return await getToken(createAuth);
});

/**
 * Get the current authenticated user server-side.
 *
 * @returns User object or null if not authenticated
 */
export const getCurrentUser = async () => {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  return await fetchQuery(api.users.getCurrentUser, {}, { token });
};

/**
 * Require authentication and return the current user.
 * Redirects to login if not authenticated.
 *
 * @param redirectTo - URL to redirect to if not authenticated (default: '/login')
 * @returns User object
 */
export const requireCurrentUser = async (redirectTo: Route<string> = '/login') => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
};

/**
 * Require admin access and return the current user.
 * Redirects to login if not authenticated, or home if not admin.
 *
 * @param redirectTo - URL to redirect to if not authenticated (default: '/login')
 * @returns Admin user object
 */
export const requireAdminUser = async (
  redirectTo: Route<string> = '/login',
): Promise<AdminUser> => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  if (!isAdmin(user)) {
    redirect('/');
  }

  return user as AdminUser;
};
