import type { Route } from 'next';
import type { ReactNode } from 'react';

import { headers } from 'next/headers';
import { Suspense } from 'react';

import { ACCOUNT_PATH, getLoginRedirect } from '@/lib/entities/paths';
import { requireCurrentUser } from '@/services/auth/server';
import { getSafeRedirect } from '@/utils';

interface UserGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

async function UserGateContent({ children }: { children: ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get('x-pathname');

  await requireCurrentUser(
    getLoginRedirect(getSafeRedirect(pathname, ACCOUNT_PATH)) as Route
  );

  return children;
}

export function UserGate({ children, fallback = null }: UserGateProps) {
  return (
    <Suspense fallback={fallback}>
      <UserGateContent>{children}</UserGateContent>
    </Suspense>
  );
}
