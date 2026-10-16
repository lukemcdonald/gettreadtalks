'use client';

import type { AreaNavSections } from './area-nav';
import type { Route } from 'next';

import { useRouter } from 'next/navigation';

import { Link, Tabs, TabsList, TabsTab } from '@/components/ui';

interface AreaTabsProps {
  activeHref: string;
  label: string;
  sections: AreaNavSections;
}

export function AreaTabs({ activeHref, label, sections }: AreaTabsProps) {
  const router = useRouter();

  return (
    <Tabs
      className="gap-0"
      onValueChange={(href) => {
        router.push(href as Route);
      }}
      value={activeHref}
    >
      <div className="border-b">
        <TabsList
          aria-label={label}
          className="w-full justify-start"
          variant="underline"
        >
          {sections.map((section) => (
            <TabsTab
              className="grow-0"
              key={section.href}
              nativeButton={false}
              render={<Link href={section.href} />}
              value={section.href}
            >
              {section.label}
            </TabsTab>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
