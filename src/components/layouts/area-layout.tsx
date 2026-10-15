import type { AreaNavItem } from '@/components/area-nav';
import type { ReactNode } from 'react';

import { AreaNav, AreaSwitcher } from '@/components/area-nav';
import { PageContainer } from '@/components/page-container';
import { Container, Section } from '@/components/ui';

interface AreaLayoutProps {
  children: ReactNode;
  items: AreaNavItem[];
  label: string;
}

export function AreaLayout({ children, items, label }: AreaLayoutProps) {
  return (
    <Section spacing="lg">
      <Container>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-12">
          <aside className="hidden space-y-6 lg:sticky lg:top-20 lg:col-span-3 lg:block lg:h-fit">
            <AreaSwitcher />
            <AreaNav items={items} label={label} variant="sidebar" />
          </aside>
          <div className="min-w-0 lg:col-span-9">
            <PageContainer>
              <div className="mb-6 space-y-4 lg:hidden">
                <AreaSwitcher />
                <AreaNav items={items} label={label} variant="tabs" />
              </div>
              <div className="space-y-6">{children}</div>
            </PageContainer>
          </div>
        </div>
      </Container>
    </Section>
  );
}
