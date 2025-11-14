'use client';

import type { ReactNode } from 'react';

import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react';
import { ConvexReactClient } from 'convex/react';
import invariant from 'tiny-invariant';

import { authClient } from '@/lib/services/auth/client';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
invariant(convexUrl, 'NEXT_PUBLIC_CONVEX_URL is not set');

const convex = new ConvexReactClient(convexUrl, {
  expectAuth: false, // Consider enabling for dashboard pages
});

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexBetterAuthProvider authClient={authClient} client={convex}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
