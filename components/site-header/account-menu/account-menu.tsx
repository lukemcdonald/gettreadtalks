'use client';

import type { User } from '@/lib/services/auth/types';

import {
  ArrowRight as ArrowRightIcon,
  Heart as FavoritesIcon,
  CheckCircle2 as FinishedIcon,
  Settings as SettingsIcon,
  LogOut as SignOutIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { AccountMenuAvatar } from '@/components/site-header/account-menu/account-menu-avatar';
import { AccountMenuItem } from '@/components/site-header/account-menu/account-menu-item';
import { NavLink } from '@/components/site-header/nav-link';
import { Button } from '@/components/ui/button';
import { Menu, MenuPopup, MenuSeparator, MenuTrigger } from '@/components/ui/menu';
import { useCurrentUser } from '@/lib/features/users/hooks';
import { signOut } from '@/lib/services/auth/client';
import { captureException } from '@/lib/services/errors/client';

interface AccountMenuProps {
  initialUser?: User;
}

export function AccountMenu({ initialUser }: AccountMenuProps) {
  const { data: user } = useCurrentUser(initialUser);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      captureException(error, {
        fingerprint: ['auth', 'logout'],
      });
    }
  };

  if (!user) {
    return (
      <NavLink href="/login" isActive={false}>
        <span>Sign In</span>
        <ArrowRightIcon className="size-4" />
      </NavLink>
    );
  }

  return (
    <Menu openOnHover>
      <MenuTrigger render={<Button variant="ghost" size="icon-lg" />} className="p-0 outline-0">
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
        <AccountMenuItem onClick={handleLogout} icon={SignOutIcon} label="Sign out" />
      </MenuPopup>
    </Menu>
  );
}
