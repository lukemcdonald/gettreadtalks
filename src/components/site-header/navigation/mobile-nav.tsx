'use client';

import type { Route } from 'next';
import type { ComponentType, SVGProps } from 'react';

import {
  CheckCircle2 as FinishedIcon,
  Heart as FavoritesIcon,
  LayoutDashboard as DashboardIcon,
  LogIn as SignInIcon,
  LogOut as SignOutIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  X as XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  DrawerMenuGroupLabel,
  DrawerMenuItem,
  DrawerMenuSeparator,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { isAdmin } from '@/services/auth/utils';
import { cn } from '@/utils';

const ACCOUNT_LINKS = [
  { href: '/account/favorites', icon: FavoritesIcon, label: 'Favorites' },
  { href: '/account/finished', icon: FinishedIcon, label: 'Finished' },
  { href: '/account', icon: SettingsIcon, label: 'Settings' },
] as const;

interface MobileNavProps {
  className?: string;
}

interface MobileNavMenuLinkProps {
  href: Route;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  isActive?: boolean;
  label: string;
}

function MobileNavMenuLink({
  href,
  icon: Icon,
  isActive,
  label,
}: MobileNavMenuLinkProps) {
  return (
    <DrawerClose
      nativeButton={false}
      render={
        <DrawerMenuItem
          className={cn(isActive && 'text-primary')}
          render={
            <Link aria-current={isActive ? 'page' : undefined} href={href} />
          }
        />
      }
    >
      {!!Icon && <Icon />}
      {label}
    </DrawerClose>
  );
}

export function MobileNav({ className }: MobileNavProps) {
  const { data: user, isLoading } = useCurrentUser();
  const pathname = usePathname();
  const showDashboardLink = isAdmin(user);

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

      <DrawerPopup showCloseButton={false} variant="straight">
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

        <DrawerPanel>
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
            {!isLoading && (
              <>
                <DrawerMenuSeparator />
                <DrawerMenuGroup>
                  <DrawerMenuGroupLabel>Account</DrawerMenuGroupLabel>
                  {user ? (
                    <>
                      <div className="text-foreground truncate px-2 py-1.5 text-sm font-semibold">
                        {user.email}
                      </div>
                      {ACCOUNT_LINKS.map((link) => (
                        <MobileNavMenuLink
                          href={link.href}
                          icon={link.icon}
                          isActive={pathname === link.href}
                          key={link.href}
                          label={link.label}
                        />
                      ))}
                      {!!showDashboardLink && (
                        <MobileNavMenuLink
                          href="/account/talks"
                          icon={DashboardIcon}
                          isActive={pathname === '/account/talks'}
                          label="Dashboard"
                        />
                      )}
                      <MobileNavMenuLink
                        href={'/logout' as Route}
                        icon={SignOutIcon}
                        label="Sign out"
                      />
                    </>
                  ) : (
                    <MobileNavMenuLink
                      href="/login"
                      icon={SignInIcon}
                      isActive={pathname === '/login'}
                      label="Sign In"
                    />
                  )}
                </DrawerMenuGroup>
              </>
            )}
          </DrawerMenu>
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  );
}
