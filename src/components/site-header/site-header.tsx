import { Container } from '@/components/container';
import { SiteBranding } from '@/components/site-header/site-branding';
import { SiteNavigation } from '@/components/site-header/site-navigation';
import { getCurrentUser } from '@/lib/services/auth/server';

export async function SiteHeader() {
  const initialUser = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 mb-6 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sm:mb-12">
      <Container className="py-3">
        <div className="flex flex-row items-center justify-between gap-2">
          <SiteBranding />
          <SiteNavigation initialUser={initialUser} />
        </div>
      </Container>
    </header>
  );
}
