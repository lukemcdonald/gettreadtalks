import { Container } from '@/components/container';
import { Section } from '@/components/section';
import { MobileNav } from '@/components/site-header/navigation/mobile-nav';
import { PrimaryNav } from '@/components/site-header/navigation/primary-nav';
import { SecondaryNav } from '@/components/site-header/navigation/secondary-nav';
import { SiteBranding } from '@/components/site-header/site-branding';
import { SiteNavigation } from '@/components/site-header/site-navigation';
import { Separator } from '@/components/ui';
import { getCurrentUser } from '@/services/auth/server';

export async function SiteHeader() {
  const initialUser = await getCurrentUser();

  return (
    <Section
      className="sticky top-0 z-50 bg-background text-foreground dark:text-muted-foreground"
      id="header"
      render={<header />}
      role="banner"
      spacing="sm"
    >
      <Container className="flex items-center justify-between gap-2">
        <SiteBranding className="flex flex-1 justify-start" />
        <PrimaryNav className="hidden justify-center md:flex lg:flex-1" />
        <SecondaryNav className="flex justify-end lg:flex-1" initialUser={initialUser} />
        <MobileNav className="md:hidden" />
      </Container>
    </Section>
  );
}
