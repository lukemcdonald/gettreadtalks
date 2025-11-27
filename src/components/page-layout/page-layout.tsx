import type { ReactNode } from 'react';

import { Container } from '@/components/container';
import { Layout } from '@/components/layout';
import { PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';

type PageLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export function PageLayout({ children, title, description, spacing = 'xl' }: PageLayoutProps) {
  return (
    <Section spacing={spacing}>
      <Container>
        {title && (
          <Layout>
            <Layout.Content>
              <PageHeader description={description} title={title} />
            </Layout.Content>
          </Layout>
        )}
        <Layout className="[&>[data-slot='layout-header']]:mb-10">{children}</Layout>
      </Container>
    </Section>
  );
}

// Re-export Layout sub-components for convenience
PageLayout.Content = Layout.Content;
PageLayout.Footer = Layout.Footer;
PageLayout.Header = Layout.Header;
PageLayout.Sidebar = Layout.Sidebar;
