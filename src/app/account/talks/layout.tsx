import type { ReactNode } from 'react';

import { Suspense } from 'react';

import { requireAdminUser } from '@/services/auth/server';

async function AdminTalksContent({ children }: { children: ReactNode }) {
  await requireAdminUser();

  return children;
}

export default function TalksLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AdminTalksContent>{children}</AdminTalksContent>
    </Suspense>
  );
}
