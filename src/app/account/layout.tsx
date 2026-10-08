import type { ReactNode } from 'react';

import { LayoutSidebar } from '@/app/account/_components/layout-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { requireCurrentUser } from '@/services/auth/server';

// Auth-gated routes render per request; do not inherit the public static prefetch.
// fallow-ignore-next-line unused-export
export const ensureStatic = false;

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireCurrentUser('/login?redirect=/account');

  return <SidebarLayout content={children} sidebar={<LayoutSidebar />} />;
}
