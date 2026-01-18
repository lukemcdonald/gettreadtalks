import type { ReactNode } from 'react';

import { LayoutSidebar } from '@/app/account/_components/layout-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { requireCurrentUser } from '@/services/auth/server';

export default async function AccountLayout({ children }: { children: ReactNode }) {
  await requireCurrentUser('/login?redirect=/account');

  return <SidebarLayout content={children} sidebar={<LayoutSidebar />} />;
}
