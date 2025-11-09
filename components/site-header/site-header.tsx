import { SiteBranding } from '@/components/site-header/branding';
import { PrimaryNav } from '@/components/site-header/primary-nav';
import { SecondaryNav } from '@/components/site-header/secondary-nav';
import { Separator } from '@/components/ui/separator';

export function SiteHeader() {
  return (
    <header className="mb-12 flex flex-row items-center justify-between gap-2 p-4 text-center">
      <SiteBranding />
      <PrimaryNav />
      <Separator orientation="vertical" />
      <SecondaryNav />
    </header>
  );
}
