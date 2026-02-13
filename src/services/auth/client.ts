'use client';

import type { SignInParams, SignUpParams } from './types';

import { convexClient } from '@convex-dev/better-auth/client/plugins';
import { adminClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

/**
 * Create a Better Auth client instance for interacting with Better Auth server from the client.
 *
 * The convexClient() plugin automatically routes auth requests to the Convex deployment.
 * baseURL is optional - if not provided, it uses relative URLs which work with the Next.js proxy.
 *
 * @returns The Better Auth client instance.
 */
export const authClient = createAuthClient({
  // baseURL is optional - convexClient() plugin handles routing to Convex
  // If you need to specify it, use the Next.js site URL (not Convex site URL)
  // since requests go through /api/auth/[...all] which proxies to Convex
  plugins: [convexClient(), adminClient()],
});

export async function signUp({ email, name, password }: SignUpParams) {
  return await authClient.signUp.email({
    email,
    name: name || email.split('@')[0],
    password,
  });
}

export async function signIn({ email, password }: SignInParams) {
  return await authClient.signIn.email({
    email,
    password,
  });
}

export async function signOut() {
  return await authClient.signOut();
}

export async function requestPasswordReset({ email }: { email: string }) {
  return await authClient.requestPasswordReset({ email, redirectTo: '/reset-password' });
}

export async function resetPassword({
  newPassword,
  token,
}: {
  newPassword: string;
  token: string;
}) {
  return await authClient.resetPassword({ newPassword, token });
}
