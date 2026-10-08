import type { ReactNode } from 'react';

import { Suspense } from 'react';

import { requireAdminUser } from '@/services/auth/server';

interface AdminGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

async function AdminGateContent({ children }: { children: ReactNode }) {
  await requireAdminUser();

  return children;
}

export function AdminGate({ children, fallback = null }: AdminGateProps) {
  return (
    <Suspense fallback={fallback}>
      <AdminGateContent>{children}</AdminGateContent>
    </Suspense>
  );
}
