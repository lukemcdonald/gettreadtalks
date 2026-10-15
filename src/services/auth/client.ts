'use client';

import type { SignInParams, SignUpParams } from './types';

import { convexClient } from '@convex-dev/better-auth/client/plugins';
import { adminClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

const AUTH_CLIENT_KEY = '__treadTalksAuthClient__';

type AuthClientInstance = ReturnType<typeof createAuthClient>;
type AuthGlobal = typeof globalThis & {
  [AUTH_CLIENT_KEY]?: AuthClientInstance;
};

function getAuthClient() {
  const global = globalThis as AuthGlobal;

  if (!global[AUTH_CLIENT_KEY]) {
    // baseURL is optional - convexClient() plugin handles routing to Convex
    // through /api/auth/[...all]. Requests must not target the Convex site URL.
    global[AUTH_CLIENT_KEY] = createAuthClient({
      plugins: [convexClient(), adminClient()],
    });
  }

  return global[AUTH_CLIENT_KEY];
}

export const authClient = getAuthClient();

function captchaFetchOptions(captchaToken?: string) {
  if (!captchaToken) {
    return {};
  }

  return {
    fetchOptions: {
      headers: {
        'x-captcha-response': captchaToken,
      },
    },
  };
}

export async function signUp({
  captchaToken,
  email,
  name,
  password,
}: SignUpParams) {
  return await authClient.signUp.email({
    email,
    name: name || email.split('@')[0],
    password,
    ...captchaFetchOptions(captchaToken),
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

export async function requestPasswordReset({
  captchaToken,
  email,
}: {
  captchaToken?: string;
  email: string;
}) {
  return await authClient.requestPasswordReset({
    email,
    redirectTo: '/reset-password',
    ...captchaFetchOptions(captchaToken),
  });
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
