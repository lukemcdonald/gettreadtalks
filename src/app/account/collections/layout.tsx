import type { ReactNode } from 'react';

import { Suspense } from 'react';

import { requireAdminUser } from '@/services/auth/server';

async function AdminCollectionsContent({ children }: { children: ReactNode }) {
  await requireAdminUser();

  return children;
}

export default function CollectionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <AdminCollectionsContent>{children}</AdminCollectionsContent>
    </Suspense>
  );
}
