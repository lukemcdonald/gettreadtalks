import { convexClient } from '@convex-dev/better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import type { SignInParams, SignUpParams } from './types';

export const authClient = createAuthClient({
  plugins: [convexClient()],
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
