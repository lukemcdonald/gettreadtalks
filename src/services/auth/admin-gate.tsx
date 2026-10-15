import type { Route } from 'next';
import type { ReactNode } from 'react';

import { Suspense } from 'react';

import { requireAdminUser } from '@/services/auth/server';

interface AdminGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirect?: Route<string>;
}

async function AdminGateContent({
  children,
  redirect,
}: {
  children: ReactNode;
  redirect?: Route<string>;
}) {
  await requireAdminUser(redirect);

  return children;
}

export function AdminGate({
  children,
  fallback = null,
  redirect,
}: AdminGateProps) {
  return (
    <Suspense fallback={fallback}>
      <AdminGateContent redirect={redirect}>{children}</AdminGateContent>
    </Suspense>
  );
}
