import { LayoutSidebar } from '@/app/account/_components/layout-sidebar';
import { Container } from '@/components/container';
import { Layout } from '@/components/layout';
import { Section } from '@/components/section';
import { requireCurrentUser } from '@/services/auth/server';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireCurrentUser('/login?redirect=/account');

  return (
    <Section py="xl">
      <Container>
        <Layout>
          <Layout.Sidebar>
            <LayoutSidebar />
          </Layout.Sidebar>
          <Layout.Content>{children}</Layout.Content>
        </Layout>
      </Container>
    </Section>
  );
}
