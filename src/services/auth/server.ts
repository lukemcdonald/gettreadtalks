import 'server-only';
import type { AdminUser } from '@/services/auth/types';
import type { Route } from 'next';

import { convexBetterAuthNextJs } from '@convex-dev/better-auth/nextjs';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { api } from '@/convex/_generated/api';
import { hasSessionCookieHeader } from '@/services/auth/session-cookie';
import { isAdmin } from '@/services/auth/utils';

// Framework-specific utilities from Convex + Better Auth
const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!(convexSiteUrl && convexUrl)) {
  throw new Error(
    'Missing required environment variables: NEXT_PUBLIC_CONVEX_SITE_URL and NEXT_PUBLIC_CONVEX_URL'
  );
}

const { fetchAuthMutation, fetchAuthQuery, getToken, handler } =
  convexBetterAuthNextJs({
    convexSiteUrl,
    convexUrl,
  });

const hasSessionCookie = cache(async () => {
  const headerList = await headers();

  return hasSessionCookieHeader(headerList.get('cookie'));
});

const getAuthToken = cache(async () => {
  if (!(await hasSessionCookie())) {
    return;
  }

  return await getToken();
});

const getCurrentUser = cache(async () => {
  if (!(await hasSessionCookie())) {
    return null;
  }

  try {
    return await fetchAuthQuery(api.users.getCurrentUser, {});
  } catch {
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
const requireAdminUser = async (
  redirectTo: Route<string> = '/login'
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

export {
  fetchAuthMutation,
  fetchAuthQuery,
  getAuthToken,
  getCurrentUser,
  handler,
  hasSessionCookie,
  requireAdminUser,
  requireCurrentUser,
};
