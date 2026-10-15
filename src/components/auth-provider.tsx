'use client';

import type { AuthClient } from '@convex-dev/better-auth/react';
import type { ReactNode } from 'react';

import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react';
import { ConvexProvider, useConvex } from 'convex/react';
import { useEffect, useState } from 'react';

import { authClient } from '@/services/auth/client';
import { getConvexClient } from '@/services/convex/client';

let hasAuthSessionOwner = false;

export function AuthProvider({ children }: { children: ReactNode }) {
  const existingClient = useConvex();

  if (existingClient) {
    return children;
  }

  return <SharedConvexTree>{children}</SharedConvexTree>;
}

function SharedConvexTree({ children }: { children: ReactNode }) {
  const convexClient = getConvexClient();
  const [ownsAuthSession, setOwnsAuthSession] = useState(() => {
    if (hasAuthSessionOwner) {
      return false;
    }

    hasAuthSessionOwner = true;

    return true;
  });

  useEffect(
    () => () => {
      if (!ownsAuthSession) {
        return;
      }

      hasAuthSessionOwner = false;
      setOwnsAuthSession(false);
    },
    [ownsAuthSession]
  );

  if (ownsAuthSession) {
    return (
      <ConvexBetterAuthProvider
        authClient={authClient as unknown as AuthClient}
        client={convexClient}
      >
        {children}
      </ConvexBetterAuthProvider>
    );
  }

  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
