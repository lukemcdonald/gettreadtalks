import { MobileNav } from '@/components/site-header/navigation/mobile-nav';
import { PrimaryNav } from '@/components/site-header/navigation/primary-nav';
import { SecondaryNav } from '@/components/site-header/navigation/secondary-nav';
import { Separator } from '@/components/ui';

export function SiteNavigation() {
  return (
    <>
      <div className="hidden items-center gap-2 md:flex">
        <PrimaryNav />
        <Separator orientation="vertical" />
        <SecondaryNav />
      </div>
      <div className="flex items-center gap-2 md:hidden">
        <SecondaryNav />
        <MobileNav />
      </div>
    </>
  );
}
