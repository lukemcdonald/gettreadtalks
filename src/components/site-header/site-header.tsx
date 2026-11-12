import { Suspense } from 'react';

import { MobileNav } from '@/components/site-header/navigation/mobile-nav';
import { PrimaryNav } from '@/components/site-header/navigation/primary-nav';
import { SecondaryNav } from '@/components/site-header/navigation/secondary-nav';
import { SiteBranding } from '@/components/site-header/site-branding';
import { Container, Section } from '@/components/ui';

export function SiteHeader() {
  return (
    <Section
      className="bg-background text-foreground dark:text-muted-foreground sticky top-0 z-50"
      id="header"
      render={<header />}
      spacing="sm"
    >
      <Container className="flex items-center justify-between gap-2">
        <SiteBranding className="flex flex-1 justify-start" />
        <Suspense>
          <PrimaryNav className="hidden justify-center md:flex lg:flex-1" />
        </Suspense>
        <SecondaryNav className="flex justify-end lg:flex-1" />
        <Suspense>
          <MobileNav className="md:hidden" />
        </Suspense>
      </Container>
    </Section>
  );
}
