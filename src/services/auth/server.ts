import 'server-only';

import type { Route } from 'next';
import type { AdminUser } from '@/services/auth/types';

import { cache } from 'react';
import { convexBetterAuthNextJs } from '@convex-dev/better-auth/nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { isAdmin } from '@/services/auth/utils';

// Framework-specific utilities from Convex + Better Auth
const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!(convexSiteUrl && convexUrl)) {
  throw new Error(
    'Missing required environment variables: NEXT_PUBLIC_CONVEX_SITE_URL and NEXT_PUBLIC_CONVEX_URL',
  );
}

const {
  fetchAuthAction,
  fetchAuthMutation,
  fetchAuthQuery,
  handler,
  getToken,
  isAuthenticated,
  preloadAuthQuery,
} = convexBetterAuthNextJs({
  convexSiteUrl,
  convexUrl,
});

/**
 * Get the authentication token for the current user.
 * Wrapped with React's cache() to ensure the token is only retrieved once per request,
 * even if called multiple times. This reduces redundant cookie reads and improves performance.
 *
 * @returns Authentication token or null if not authenticated
 */
const getAuthToken = cache(async () => {
  // Always access cookies to satisfy Next.js 16 Turbopack requirements
  // This ensures dynamic rendering before Math.random() usage in betterAuth
  // Avoids the "used Math.random() before accessing Request data" error on page and builds.
  await cookies();
  return await getToken();
});

/**
 * Get the current authenticated user server-side.
 *
 * Uses fetchAuthQuery which automatically handles:
 * - Cookie reading and token extraction
 * - Passing auth token to Convex query
 * - Error handling for unauthenticated requests
 *
 * @returns User object or null if not authenticated
 */
const getCurrentUser = cache(async () => {
  // Always access cookies to satisfy Next.js 16 Turbopack requirements
  // This ensures dynamic rendering before Math.random() usage in betterAuth
  await cookies();

  // fetchAuthQuery handles token extraction and passing automatically
  try {
    return await fetchAuthQuery(api.users.getCurrentUser, {});
  } catch {
    // If query fails, user is not authenticated
    return null;
  }
});

/**
 * Require authentication and return the current user.
 * Redirects to login if not authenticated.
 *
 * @param redirectTo - URL to redirect to if not authenticated (default: '/login')
 * @returns User object
 */
const requireCurrentUser = async (redirectTo: Route<string> = '/login') => {
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
const requireAdminUser = async (redirectTo: Route<string> = '/login'): Promise<AdminUser> => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  if (!isAdmin(user)) {
    redirect('/');
  }

  return user as AdminUser;
};

export {
  fetchAuthAction,
  fetchAuthMutation,
  fetchAuthQuery,
  getAuthToken,
  getCurrentUser,
  handler,
  isAuthenticated,
  preloadAuthQuery,
  requireAdminUser,
  requireCurrentUser,
};
