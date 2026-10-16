'use client';

import type { AreaNavSections } from '@/components/area-nav';
import type { ReactNode } from 'react';

import { usePathname } from 'next/navigation';

import { AreaNav, AreaTabs, getActiveSection } from '@/components/area-nav';
import { PageContainer } from '@/components/page-container';
import { Section } from '@/components/ui';

interface AreaLayoutProps {
  children: ReactNode;
  label: string;
  sections: AreaNavSections;
}

export function AreaLayout({ children, label, sections }: AreaLayoutProps) {
  const pathname = usePathname();
  const section = getActiveSection(sections, pathname);
  const showSubNav = section.items.length > 1;

  return (
    <Section spacing="lg">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <AreaTabs activeHref={section.href} label={label} sections={sections} />
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {showSubNav ? (
            <aside className="hidden w-52 shrink-0 lg:sticky lg:top-20 lg:block lg:h-fit">
              <AreaNav
                items={section.items}
                label={section.label}
                variant="sidebar"
              />
            </aside>
          ) : null}
          <div className="min-w-0 flex-1">
            {showSubNav ? (
              <div className="mb-6 lg:hidden">
                <AreaNav
                  items={section.items}
                  label={section.label}
                  variant="tabs"
                />
              </div>
            ) : null}
            <PageContainer>
              <div className="space-y-6">{children}</div>
            </PageContainer>
          </div>
        </div>
      </div>
    </Section>
  );
}
