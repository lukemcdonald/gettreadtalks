import { Container } from '@/components/container';
import { Section } from '@/components/section';
import { SiteBranding } from '@/components/site-header/site-branding';
import { SiteNavigation } from '@/components/site-header/site-navigation';
import { getCurrentUser } from '@/services/auth/server';

export async function SiteHeader() {
  const initialUser = await getCurrentUser();

  return (
    <Section
      className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80"
      render={<header />}
      variant="xs"
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
