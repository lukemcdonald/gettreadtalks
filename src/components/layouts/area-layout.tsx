import type { AreaNavItem } from '@/components/area-nav';
import type { ReactNode } from 'react';

import { AreaNav } from '@/components/area-nav';
import { PageContainer } from '@/components/page-container';
import { Section } from '@/components/ui';

interface AreaLayoutProps {
  children: ReactNode;
  items: AreaNavItem[];
  label: string;
}

export function AreaLayout({ children, items, label }: AreaLayoutProps) {
  return (
    <Section spacing="lg">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 lg:flex-row lg:gap-8">
        <aside className="hidden w-52 shrink-0 lg:sticky lg:top-20 lg:block lg:h-fit">
          <AreaNav items={items} label={label} variant="sidebar" />
        </aside>
        <div className="min-w-0 flex-1">
          <div className="mb-6 lg:hidden">
            <AreaNav items={items} label={label} variant="tabs" />
          </div>
          <PageContainer>
            <div className="space-y-6">{children}</div>
          </PageContainer>
        </div>
      </div>
    </Section>
  );
}
