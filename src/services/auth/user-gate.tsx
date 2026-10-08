import type { Route } from 'next';
import type { ReactNode } from 'react';

import { Suspense } from 'react';

import { requireCurrentUser } from '@/services/auth/server';

interface UserGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirect?: Route<string>;
}

async function UserGateContent({
  children,
  redirect,
}: {
  children: ReactNode;
  redirect?: Route<string>;
}) {
  await requireCurrentUser(redirect);

  return children;
}

export function UserGate({
  children,
  fallback = null,
  redirect,
}: UserGateProps) {
  return (
    <Suspense fallback={fallback}>
      <UserGateContent redirect={redirect}>{children}</UserGateContent>
    </Suspense>
  );
}
