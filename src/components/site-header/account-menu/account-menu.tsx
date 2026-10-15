'use client';

import type { User } from '@/services/auth/types';
import type { Route } from 'next';

import {
  ArrowRight as ArrowRightIcon,
  CheckCircle2 as FinishedIcon,
  CircleUser as UserIcon,
  Heart as FavoritesIcon,
  LayoutDashboard as ManageIcon,
  LogOut as SignOutIcon,
  Settings as SettingsIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import { AccountMenuItem } from '@/components/site-header/account-menu/account-menu-item';
import { NavLink } from '@/components/site-header/navigation/nav-link';
import {
  Button,
  Menu,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui';
import { Link } from '@/components/ui/link';
import { ACCOUNT_PATH, MANAGE_PATH } from '@/lib/entities/paths';
import { isAdmin } from '@/services/auth/utils';

interface AccountMenuProps {
  initialUser?: User | null;
}

export function AccountMenu({ initialUser }: AccountMenuProps) {
  const pathname = usePathname();
  const user = initialUser ?? null;

  if (!user) {
    return (
      <>
        <div className="lg:hidden">
          <Button
            aria-label="Sign In"
            className="lg:gap-2"
            data-testid="sign-in"
            render={<Link href="/login" />}
            size="icon-lg"
            variant="ghost"
          >
            <UserIcon className="size-6" />
          </Button>
        </div>
        <div className="hidden lg:block">
          <NavLink
            data-testid="sign-in"
            href="/login"
            isActive={pathname === '/login'}
          >
            <span>Sign In</span>
            <ArrowRightIcon className="size-4" />
          </NavLink>
        </div>
      </>
    );
  }

  const showManageLink = isAdmin(user);

  return (
    <Menu>
      <MenuTrigger
        openOnHover
        render={
          <Button
            className="size-10"
            data-testid="account-menu"
            size="icon-lg"
            variant="ghost"
          />
        }
      >
        <UserIcon className="size-6" />
      </MenuTrigger>
      <MenuPopup className="w-60">
        <div className="flex flex-col px-3 pt-2 pb-1">
          <span className="text-muted-foreground text-xs">Signed in as</span>
          <span className="text-foreground truncate text-sm font-semibold">
            {user.email}
          </span>
        </div>
        <MenuSeparator />
        <AccountMenuItem
          href="/account/favorites"
          icon={FavoritesIcon}
          label="Favorites"
        />
        <AccountMenuItem
          href="/account/finished"
          icon={FinishedIcon}
          label="Finished"
        />
        <MenuSeparator />
        <AccountMenuItem
          href={ACCOUNT_PATH}
          icon={SettingsIcon}
          label="Settings"
        />
        {!!showManageLink && (
          <AccountMenuItem
            href={MANAGE_PATH}
            icon={ManageIcon}
            label="Manage"
          />
        )}
        <AccountMenuItem
          data-testid="sign-out"
          href={'/logout' as Route}
          icon={SignOutIcon}
          label="Sign out"
        />
      </MenuPopup>
    </Menu>
  );
}
