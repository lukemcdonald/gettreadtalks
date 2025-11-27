import type { ReactNode } from 'react';

import { Container } from '@/components/container';
import { Layout } from '@/components/layout';
import { Section } from '@/components/section';

type PageLayoutProps = {
  children: ReactNode;
  containerClassName?: string;
  sectionPy?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  header?: ReactNode;
  footer?: ReactNode;
};

export function PageLayout({
  children,
  containerClassName,
  sectionPy = 'xl',
  header,
  footer,
}: PageLayoutProps) {
  return (
    <Section py={sectionPy}>
      <Container className={containerClassName}>
        {header}
        <Layout>{children}</Layout>
        {footer}
      </Container>
    </Section>
  );
}

// Re-export Layout sub-components for convenience
PageLayout.Content = Layout.Content;
PageLayout.Sidebar = Layout.Sidebar;
