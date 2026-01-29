'use client';

import type { ReactNode } from 'react';

import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react';
import { ConvexReactClient } from 'convex/react';
import invariant from 'tiny-invariant';

import { authClient } from '@/services/auth/client';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
invariant(convexUrl, 'NEXT_PUBLIC_CONVEX_URL is not set');

const convex = new ConvexReactClient(convexUrl, {
  // Global provider wraps both public and authenticated routes - keep false to avoid
  // auth errors on public pages. Authenticated routes handle their own auth requirements.
  expectAuth: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexBetterAuthProvider authClient={authClient} client={convex}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
