import { Container } from '@/components/container';
import { Section } from '@/components/section';
import { SiteBranding } from '@/components/site-header/site-branding';
import { SiteNavigation } from '@/components/site-header/site-navigation';
import { getCurrentUser } from '@/services/auth/server';

export async function SiteHeader() {
  const initialUser = await getCurrentUser();

  return (
    <Section
      className="sticky top-0 z-50 bg-background"
      id="header"
      render={<header />}
      role="banner"
      spacing="sm"
    >
      <Container>
        <div className="flex flex-row items-center justify-between gap-2">
          <SiteBranding />
          <SiteNavigation initialUser={initialUser} />
        </div>
      </Container>
    </Section>
  );
}
