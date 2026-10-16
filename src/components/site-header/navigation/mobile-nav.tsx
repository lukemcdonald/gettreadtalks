'use client';

import type { Route } from 'next';

import { Menu as MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { AccountIdentity } from '@/components/site-header/account-menu/account-identity';
import {
  ACCOUNT_MENU_SIGN_OUT_HREF,
  getAccountMenuLinks,
  isAccountMenuLinkActive,
} from '@/components/site-header/account-menu/account-menu-links';
import { NAVIGATION_LINKS } from '@/components/site-header/constants';
import { ModeSwitcher } from '@/components/site-header/mode-switcher';
import { SiteBranding } from '@/components/site-header/site-branding';
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerHeader,
  DrawerMenu,
  DrawerMenuGroup,
  DrawerMenuItem,
  DrawerMenuSeparator,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui';
import { Link } from '@/components/ui/link';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { isAdmin } from '@/services/auth/utils';
import { cn } from '@/utils';

interface MobileNavProps {
  className?: string;
}

interface MobileNavMenuLinkProps {
  className?: string;
  href: Route;
  isActive?: boolean;
  label: string;
}

function MobileNavMenuLink({
  className,
  href,
  isActive,
  label,
}: MobileNavMenuLinkProps) {
  return (
    <DrawerClose
      nativeButton={false}
      render={
        <DrawerMenuItem
          className={cn(isActive && 'text-primary', className)}
          render={
            <Link aria-current={isActive ? 'page' : undefined} href={href} />
          }
        />
      }
    >
      {label}
    </DrawerClose>
  );
}

export function MobileNav({ className }: MobileNavProps) {
  const { data: user, isLoading } = useCurrentUser();
  const pathname = usePathname();
  const showManageLink = isAdmin(user);

  return (
    <Drawer position="right">
      <DrawerTrigger
        render={
          <Button
            aria-label="Open navigation menu"
            className={className}
            size="icon-lg"
            variant="ghost"
          >
            <MenuIcon className="size-6 transition-transform" />
          </Button>
        }
      />

      <DrawerPopup showBar showCloseButton variant="default">
        <DrawerHeader className="flex-row items-center justify-between pe-12">
          <DrawerTitle className="sr-only">Navigation menu</DrawerTitle>
          <SiteBranding />
          <ModeSwitcher className="size-10" />
        </DrawerHeader>

        <DrawerPanel scrollable={false}>
          <DrawerMenu aria-label="Mobile navigation">
            <DrawerMenuGroup>
              {NAVIGATION_LINKS.map((link) => (
                <MobileNavMenuLink
                  href={link.href}
                  isActive={pathname === link.href}
                  key={link.href}
                  label={link.label}
                />
              ))}
            </DrawerMenuGroup>
            {isLoading ? null : (
              <>
                <DrawerMenuSeparator />
                {user ? (
                  <>
                    <AccountIdentity user={user} />
                    <DrawerMenuGroup>
                      {getAccountMenuLinks(showManageLink).map((link) => (
                        <MobileNavMenuLink
                          href={link.href}
                          isActive={isAccountMenuLinkActive(
                            link.href,
                            pathname
                          )}
                          key={link.href}
                          label={link.label}
                        />
                      ))}
                    </DrawerMenuGroup>
                    <MobileNavMenuLink
                      className="text-muted-foreground"
                      href={ACCOUNT_MENU_SIGN_OUT_HREF}
                      label="Sign out"
                    />
                  </>
                ) : (
                  <DrawerMenuGroup>
                    <MobileNavMenuLink
                      href="/login"
                      isActive={pathname === '/login'}
                      label="Sign In"
                    />
                  </DrawerMenuGroup>
                )}
              </>
            )}
          </DrawerMenu>
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  );
}
