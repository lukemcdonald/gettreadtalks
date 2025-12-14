import type { User } from '@/services/auth/types';

import { MobileNav } from '@/components/site-header/navigation/mobile-nav';
import { PrimaryNav } from '@/components/site-header/navigation/primary-nav';
import { SecondaryNav } from '@/components/site-header/navigation/secondary-nav';
import { Separator } from '@/components/ui';

type SiteNavigationProps = {
  initialUser?: User;
};

export function SiteNavigation({ initialUser }: SiteNavigationProps) {
  return (
    <>
      <div className="hidden items-center gap-2 md:flex">
        <PrimaryNav />
        <Separator orientation="vertical" />
        <SecondaryNav initialUser={initialUser} />
      </div>
      <div className="flex items-center gap-2 md:hidden">
        <SecondaryNav initialUser={initialUser} />
        <MobileNav />
      </div>
    </>
  );
}
