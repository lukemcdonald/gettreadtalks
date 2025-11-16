import { SiteBranding } from '@/components/site-header/site-branding';
import { SiteNavigation } from '@/components/site-header/site-navigation';
import { getCurrentUser } from '@/lib/services/auth/server';

export async function SiteHeader() {
  const initialUser = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 mb-6 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sm:mb-12">
      <div className="container mx-auto flex flex-row items-center justify-between gap-2 p-4">
        <h1 className="flex items-center text-2xl">
          <SiteBranding />
        </h1>
        <SiteNavigation initialUser={initialUser} />
      </div>
    </header>
  );
}
