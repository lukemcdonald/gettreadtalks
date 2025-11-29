'use client';

import type { SignInParams, SignUpParams } from './types';

import { convexClient } from '@convex-dev/better-auth/client/plugins';
import { adminClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

/**
 * Create a Better Auth client instance for interacting with Better Auth server from the client.
 *
 * @returns The Better Auth client instance.
 */
export const authClient = createAuthClient({
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
