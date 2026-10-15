import type { TabNavItem } from '@/components/tab-nav';
import type { ReactNode } from 'react';

import { PageContainer } from '@/components/page-container';
import { TabNav } from '@/components/tab-nav';
import { Container, Section } from '@/components/ui';

interface AreaLayoutProps {
  children: ReactNode;
  items: TabNavItem[];
  label: string;
}

export function AreaLayout({ children, items, label }: AreaLayoutProps) {
  return (
    <Section spacing="lg">
      <Container>
        <PageContainer>
          <TabNav items={items} label={label} />
          <div className="mt-6 min-w-0 space-y-6">{children}</div>
        </PageContainer>
      </Container>
    </Section>
  );
}
