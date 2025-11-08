'use client';

import type { User } from '@/lib/services/auth/types';

import {
  Heart as FavoritesIcon,
  CheckCircle2 as FinishedIcon,
  Settings as SettingsIcon,
  LogOut as SignOutIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from '@/components/ui/menu';
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
        fingerprint: ['auth', 'logout', 'client-error'],
      });
    }
  };

  if (!user) {
    return (
      <Menu>
        <MenuTrigger render={<Button variant="outline" />}>Account</MenuTrigger>
        <MenuPopup>
          <MenuItem render={<Link href="/login" />}>Login</MenuItem>
        </MenuPopup>
      </Menu>
    );
  }

  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline" />}>Account</MenuTrigger>
      <MenuPopup>
        <div className="flex flex-col px-2 py-1.5">
          <span className="text-muted-foreground text-xs">Signed in as</span>
          <span className="font-semibold text-foreground text-sm">{user.email}</span>
        </div>
        <MenuSeparator />
        <MenuItem render={<Link href="/account/favorites" />}>
          <FavoritesIcon className="size-4" />
          Favorites
        </MenuItem>
        <MenuItem render={<Link href="/account/finished" />}>
          <FinishedIcon className="size-4" />
          Finished
        </MenuItem>
        <MenuItem render={<Link href="/account" />}>
          <SettingsIcon className="size-4" />
          Settings
        </MenuItem>
        <MenuSeparator />
        <MenuItem onClick={handleLogout}>
          <SignOutIcon className="size-4" />
          <span>Sign out</span>
        </MenuItem>
      </MenuPopup>
    </Menu>
  );
}
