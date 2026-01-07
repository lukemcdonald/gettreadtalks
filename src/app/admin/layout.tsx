import { AdminSidebar } from '@/app/admin/_components/admin-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { requireAdminUser } from '@/services/auth/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminUser();

  return <SidebarLayout content={children} sidebar={<AdminSidebar />} />;
}
