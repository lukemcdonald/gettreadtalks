import { LayoutSidebar } from '@/app/account/_components/layout-sidebar';
import { SidebarLayout } from '@/components/layouts/sidebar-layout';
import { requireCurrentUser } from '@/services/auth/server';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireCurrentUser('/login?redirect=/account');

  return <SidebarLayout sidebar={<LayoutSidebar />}>{children}</SidebarLayout>;
}
