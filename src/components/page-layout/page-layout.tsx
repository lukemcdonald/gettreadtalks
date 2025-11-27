import type { ReactNode } from 'react';

import { Container } from '@/components/container';
import { Layout } from '@/components/layout';
import { Section } from '@/components/section';

type PageLayoutProps = {
  children: ReactNode;
  containerClassName?: string;
  sectionPy?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export function PageLayout({ children, containerClassName, sectionPy = 'xl' }: PageLayoutProps) {
  return (
    <Section py={sectionPy}>
      <Container className={containerClassName}>
        <Layout>{children}</Layout>
      </Container>
    </Section>
  );
}

// Re-export Layout sub-components for convenience
PageLayout.Content = Layout.Content;
PageLayout.Header = Layout.Header;
PageLayout.Sidebar = Layout.Sidebar;
