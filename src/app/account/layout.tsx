import { LayoutSidebar } from '@/app/account/_components/layout-sidebar';
import { PageLayout } from '@/components/page-layout';
import { requireCurrentUser } from '@/services/auth/server';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireCurrentUser('/login?redirect=/account');

  return (
    <PageLayout>
      <PageLayout.Sidebar>
        <LayoutSidebar />
      </PageLayout.Sidebar>
      <PageLayout.Content>{children}</PageLayout.Content>
    </PageLayout>
  );
}
