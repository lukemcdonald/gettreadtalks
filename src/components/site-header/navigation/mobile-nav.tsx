'use client';

import type { User } from '@/services/auth/types';
import type { Route } from 'next';

import { Menu as MenuIcon, X as XIcon } from 'lucide-react';
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
  BottomDrawer,
  BottomDrawerPanel,
  BottomDrawerPopup,
  Button,
  CommandPanel,
  DrawerClose,
  DrawerHeader,
  DrawerMenu,
  DrawerMenuGroup,
  DrawerMenuItem,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui';
import { Link } from '@/components/ui/link';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { isAdmin } from '@/services/auth/utils';
import { cn } from '@/utils';

interface MobileNavProps {
  className?: string;
  initialUser?: User | null;
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

export function MobileNav({ className, initialUser }: MobileNavProps) {
  const { data: user, isLoading } = useCurrentUser(initialUser);
  const pathname = usePathname();
  const showContentLink = isAdmin(user);

  return (
    <BottomDrawer>
      <DrawerTrigger
        render={
          <Button
            aria-label="Open navigation menu"
            className={className}
            size="icon-lg"
            variant="ghost"
          >
            <MenuIcon className="size-6" />
          </Button>
        }
      />

      <BottomDrawerPopup>
        <DrawerHeader className="flex-row items-center justify-between">
          <DrawerTitle className="sr-only">Navigation menu</DrawerTitle>
          <SiteBranding />
          <div className="flex items-center gap-2">
            <ModeSwitcher className="size-10" />
            <DrawerClose
              render={
                <Button
                  aria-label="Close navigation menu"
                  size="icon-lg"
                  variant="ghost"
                >
                  <XIcon className="size-6" />
                </Button>
              }
            />
          </div>
        </DrawerHeader>

        <BottomDrawerPanel>
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
          </DrawerMenu>

          {!isLoading && (
            <CommandPanel className="-mx-6 mt-6 rounded-b-none p-6 [clip-path:inset(0_1px)] not-has-[+[data-slot=command-footer]]:-mb-6 not-has-[+[data-slot=command-footer]]:rounded-b-none not-has-[+[data-slot=command-footer]]:[clip-path:inset(0_1px)]">
              <DrawerMenu>
                {user ? (
                  <>
                    <AccountIdentity user={user} />
                    <DrawerMenuGroup>
                      {getAccountMenuLinks(showContentLink).map((link) => (
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
              </DrawerMenu>
            </CommandPanel>
          )}
        </BottomDrawerPanel>
      </BottomDrawerPopup>
    </BottomDrawer>
  );
}
