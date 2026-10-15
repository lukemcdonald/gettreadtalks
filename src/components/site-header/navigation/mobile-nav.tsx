'use client';

import type { Route } from 'next';
import type { ComponentType, SVGProps } from 'react';

import {
  CheckCircle2 as FinishedIcon,
  Heart as FavoritesIcon,
  LayoutDashboard as ManageIcon,
  LogIn as SignInIcon,
  LogOut as SignOutIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  X as XIcon,
} from 'lucide-react';
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
import { Link } from '@/components/ui/link';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { ACCOUNT_PATH, MANAGE_PATH } from '@/lib/entities/paths';
import { isAdmin } from '@/services/auth/utils';
import { cn } from '@/utils';

const ACCOUNT_LINKS = [
  { href: '/account/favorites', icon: FavoritesIcon, label: 'Favorites' },
  { href: '/account/finished', icon: FinishedIcon, label: 'Finished' },
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
                      <div className="flex flex-col px-2 py-1.5">
                        <span className="text-muted-foreground text-xs">
                          Signed in as
                        </span>
                        <span className="text-foreground truncate text-sm font-semibold">
                          {user.email}
                        </span>
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
                      <DrawerMenuSeparator />
                      <MobileNavMenuLink
                        href={ACCOUNT_PATH}
                        icon={SettingsIcon}
                        isActive={pathname === ACCOUNT_PATH}
                        label="Settings"
                      />
                      {!!showManageLink && (
                        <MobileNavMenuLink
                          href={MANAGE_PATH}
                          icon={ManageIcon}
                          isActive={pathname.startsWith(MANAGE_PATH)}
                          label="Manage"
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
