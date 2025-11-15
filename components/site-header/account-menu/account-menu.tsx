'use client';

import type { Route } from 'next';
import type { User } from '@/lib/services/auth/types';

import {
  ArrowRight as ArrowRightIcon,
  Heart as FavoritesIcon,
  CheckCircle2 as FinishedIcon,
  Settings as SettingsIcon,
  LogOut as SignOutIcon,
  CircleUser as UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AccountMenuAvatar } from '@/components/site-header/account-menu/account-menu-avatar';
import { AccountMenuItem } from '@/components/site-header/account-menu/account-menu-item';
import { NavLink } from '@/components/site-header/nav-link';
import { Button } from '@/components/ui/button';
import { Menu, MenuPopup, MenuSeparator, MenuTrigger } from '@/components/ui/menu';
import { useCurrentUser } from '@/lib/features/users/hooks';

type AccountMenuProps = {
  initialUser?: User;
};

export function AccountMenu({ initialUser }: AccountMenuProps) {
  const { data: user } = useCurrentUser(initialUser);
  const pathname = usePathname();

  if (!user) {
    return (
      <>
        <div className="lg:hidden">
          <Button
            className="lg:gap-2"
            render={<Link href="/login" />}
            size="icon-lg"
            variant="ghost"
          >
            <UserIcon className="size-6" />
            <span className="sr-only">Sign In</span>
          </Button>
        </div>
        <div className="hidden lg:block">
          <NavLink href="/login" isActive={pathname === '/login'}>
            <span>Sign In</span>
            <ArrowRightIcon className="size-4" />
          </NavLink>
        </div>
      </>
    );
  }

  return (
    <Menu openOnHover>
      <MenuTrigger render={<Button className="size-10" size="icon-lg" variant="ghost" />}>
        <AccountMenuAvatar user={user} />
      </MenuTrigger>
      <MenuPopup>
        <div className="flex flex-col px-2 pt-1">
          <span className="text-muted-foreground text-xs">Signed in as</span>
          <span className="font-semibold text-foreground text-sm">{user.email}</span>
        </div>
        <MenuSeparator />
        <AccountMenuItem href="/account/favorites" icon={FavoritesIcon} label="Favorites" />
        <AccountMenuItem href="/account/finished" icon={FinishedIcon} label="Finished" />
        <AccountMenuItem href="/account" icon={SettingsIcon} label="Settings" />
        <MenuSeparator />
        <AccountMenuItem href={'/logout' as Route} icon={SignOutIcon} label="Sign out" />
      </MenuPopup>
    </Menu>
  );
}
