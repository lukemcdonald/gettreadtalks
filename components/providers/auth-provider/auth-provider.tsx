'use client';

import { ReactNode } from 'react';

import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react';
import { ConvexReactClient } from 'convex/react';

import { authClient } from '../../../lib/services/auth/client';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  // Optionally pause queries until the user is authenticated
  expectAuth: true,
});

function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}

export default AuthProvider;
