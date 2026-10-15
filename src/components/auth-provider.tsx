'use client';

import type { AuthClient } from '@convex-dev/better-auth/react';
import type { ReactNode } from 'react';

import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react';
import { ConvexReactClient } from 'convex/react';
import invariant from 'tiny-invariant';

import { authClient } from '@/services/auth/client';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
invariant(convexUrl, 'NEXT_PUBLIC_CONVEX_URL is not set');

const convex = new ConvexReactClient(convexUrl, {
  // Shared by account/manage layouts and public auth islands. Keep false so
  // signed-in islands can mount before client auth finishes syncing.
  expectAuth: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexBetterAuthProvider
      authClient={authClient as unknown as AuthClient}
      client={convex}
    >
      {children}
    </ConvexBetterAuthProvider>
  );
}
