import type { MetadataSidebarLayout } from '@/components/metadata-sidebar';
import type { ReactNode } from 'react';

import { Suspense } from 'react';

import { MetadataGroup } from '@/components/metadata-group';
import { getCurrentUser } from '@/services/auth/server';
import { isAdmin } from '@/services/auth/utils';

interface AdminActionsGroupProps {
  children: ReactNode;
  layout: MetadataSidebarLayout;
}

async function AdminActionsGate({ children, layout }: AdminActionsGroupProps) {
  const user = await getCurrentUser();

  if (!isAdmin(user)) {
    return null;
  }

  return (
    <MetadataGroup
      className={
        layout === 'column' ? 'border-border w-full border-t pt-6' : undefined
      }
      label="Admin"
    >
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </MetadataGroup>
  );
}

/** Sidebar group shown only to admins; renders nothing for readers. */
export function AdminActionsGroup({
  children,
  layout,
}: AdminActionsGroupProps) {
  return (
    <Suspense fallback={null}>
      <AdminActionsGate layout={layout}>{children}</AdminActionsGate>
    </Suspense>
  );
}
