import type { ReactNode } from 'react';

import { Suspense } from 'react';

import { MetadataGroup } from '@/components/metadata-group';
import { getCurrentUser } from '@/services/auth/server';
import { isAdmin } from '@/services/auth/utils';

async function AdminActionsGate({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!isAdmin(user)) {
    return null;
  }

  return (
    <MetadataGroup className="border-border w-full border-t pt-6" label="Admin">
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </MetadataGroup>
  );
}

/** Sidebar group shown only to admins; renders nothing for readers. */
export function AdminActionsGroup({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AdminActionsGate>{children}</AdminActionsGate>
    </Suspense>
  );
}
