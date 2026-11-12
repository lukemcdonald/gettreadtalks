'use client';

import type { SignInParams, SignUpParams } from './types';

import { convexClient } from '@convex-dev/better-auth/client/plugins';
import { adminClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { isAnonymousAuthSessionProbe } from '@/services/auth/session-cookie';
import { getSessionCookiePresence } from '@/services/auth/session-presence-store';

function getRequestUrl(input: RequestInfo | URL) {
  if (typeof input === 'string') {
    return input;
  }

  if (input instanceof URL) {
    return input.href;
  }

  return input.url;
}

function shouldSkipAnonymousAuthFetch(input: RequestInfo | URL) {
  return isAnonymousAuthSessionProbe(
    getRequestUrl(input),
    getSessionCookiePresence()
  );
}

function createEmptySessionResponse() {
  return new Response('null', {
    headers: {
      'Content-Type': 'application/json',
    },
    status: 200,
  });
}

export const authClient = createAuthClient({
  fetchOptions: {
    customFetchImpl: (input, init) => {
      if (shouldSkipAnonymousAuthFetch(input)) {
        return Promise.resolve(createEmptySessionResponse());
      }

      return fetch(input, init);
    },
  },
  plugins: [convexClient(), adminClient()],
});

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
