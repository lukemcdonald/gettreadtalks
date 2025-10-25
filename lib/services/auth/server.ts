'use server';

import type { Route } from 'next';

import { getToken } from '@convex-dev/better-auth/nextjs';
import { fetchQuery } from 'convex/nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { createAuth } from '@/convex/auth';

/**
 * Get the authentication token for the current user.
 *
 * @returns Authentication token or null if not authenticated
 */
export const getAuthToken = async () => {
  // Always access cookies to satisfy Next.js 16 Turbopack requirements
  // This ensures dynamic rendering before Math.random() usage in betterAuth
  // Avoids the "used Math.random() before accessing Request data" error on page and builds.
  await cookies();
  return await getToken(createAuth);
};

/**
 * Get the current authenticated user server-side.
 *
 * @returns User object or null if not authenticated
 */
export const getAuthUser = async () => {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  return await fetchQuery(api.users.getAuthUser, {}, { token });
};

/**
 * Require authentication and return the current user.
 * Redirects to login if not authenticated.
 *
 * @param redirectTo - URL to redirect to if not authenticated (default: '/login')
 * @returns User object
 */
export const requireAuthUser = async (redirectTo: Route<string> = '/login') => {
  const user = await getAuthUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
};
