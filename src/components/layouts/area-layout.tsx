import type { TabNavItem } from '@/components/tab-nav';
import type { ReactNode } from 'react';

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
        <TabNav items={items} label={label} />
        <div className="mt-6 min-w-0">{children}</div>
      </Container>
    </Section>
  );
}
