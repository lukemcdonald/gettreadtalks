import { SiteBranding } from '@/components/site-header/branding';
import { MobileNav } from '@/components/site-header/mobile-nav';
import { PrimaryNav } from '@/components/site-header/primary-nav';
import { SecondaryNav } from '@/components/site-header/secondary-nav';
import { Separator } from '@/components/ui/separator';
import { getCurrentUser } from '@/lib/services/auth/server';

export async function SiteHeader() {
  const initialUser = await getCurrentUser();

  return (
    <>
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        href="#main-content"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-50 mb-6 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sm:mb-12">
        <div className="container mx-auto flex flex-row items-center justify-between gap-2 p-4">
          <SiteBranding />
          <div className="hidden items-center gap-2 lg:flex">
            <PrimaryNav />
            <Separator orientation="vertical" />
            <SecondaryNav initialUser={initialUser} />
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <SecondaryNav initialUser={initialUser} />
            <MobileNav />
          </div>
        </div>
      </header>
    </>
  );
}
