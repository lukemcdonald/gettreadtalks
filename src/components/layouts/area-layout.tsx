'use client';

import type { Route } from 'next';
import type { ReactNode } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import {
  AreaNav,
  getActiveSection,
  getVisibleSections,
  isManagePath,
} from '@/components/area-nav';
import { PageContainer } from '@/components/page-container';
import { Link, Section, Tabs, TabsList, TabsTab } from '@/components/ui';
import { useIsAdmin } from '@/features/users/hooks/use-is-admin';

export function AreaLayout({ children }: { children: ReactNode }) {
  const isAdmin = useIsAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const sections = getVisibleSections(isAdmin || isManagePath(pathname));
  const section = getActiveSection(sections, pathname);

  return (
    <Section spacing="lg">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <Tabs
          className="gap-0"
          onValueChange={(href) => {
            router.push(href as Route);
          }}
          value={section.href}
        >
          <div className="border-b">
            <TabsList
              aria-label="Account"
              className="w-full justify-start"
              variant="underline"
            >
              {sections.map((item) => (
                <TabsTab
                  className="grow-0"
                  key={item.href}
                  nativeButton={false}
                  render={<Link href={item.href} />}
                  value={item.href}
                >
                  {item.label}
                </TabsTab>
              ))}
            </TabsList>
          </div>
        </Tabs>
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <aside className="hidden w-52 shrink-0 lg:sticky lg:top-20 lg:block lg:h-fit">
            <AreaNav
              items={section.items}
              label={section.label}
              variant="sidebar"
            />
          </aside>
          <div className="min-w-0 flex-1">
            <div className="mb-6 lg:hidden">
              <AreaNav
                items={section.items}
                label={section.label}
                variant="tabs"
              />
            </div>
            <PageContainer>
              <div className="space-y-6">{children}</div>
            </PageContainer>
          </div>
        </div>
      </div>
    </Section>
  );
}
