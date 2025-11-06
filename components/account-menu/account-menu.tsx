'use client';

import type { User } from '@/lib/services/auth/types';

import { CheckCircle2, Heart, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from '@/components/ui/menu';
import { useAuthUser } from '@/lib/features/users/hooks';
import { signOut } from '@/lib/services/auth/client';
import { captureException } from '@/lib/services/errors/client';

interface AccountMenuProps {
  initialUser?: User;
}

export function AccountMenu({ initialUser }: AccountMenuProps) {
  const { data: user } = useAuthUser(initialUser);
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
        <MenuTrigger asChild>
          <Button variant="outline">Account</Button>
        </MenuTrigger>
        <MenuPopup>
          <MenuItem asChild>
            <Link href="/login">Login</Link>
          </MenuItem>
        </MenuPopup>
      </Menu>
    );
  }

  return (
    <Menu>
      <MenuTrigger asChild>
        <Button variant="outline">Account</Button>
      </MenuTrigger>
      <MenuPopup>
        <div className="px-2 py-1.5 text-xs text-muted-foreground">Signed in as</div>
        <div className="px-2 pb-1.5 text-sm font-semibold">{user.email}</div>
        <MenuSeparator />
        <MenuItem asChild>
          <Link href="/account/favorites">
            <Heart className="size-4" />
            Favorites
          </Link>
        </MenuItem>
        <MenuItem asChild>
          <Link href="/account/finished">
            <CheckCircle2 className="size-4" />
            Finished
          </Link>
        </MenuItem>
        <MenuItem asChild>
          <Link href="/account">
            <Settings className="size-4" />
            Settings
          </Link>
        </MenuItem>
        <MenuSeparator />
        <MenuItem onClick={handleLogout}>
          <LogOut className="size-4" />
          <span>Sign out</span>
        </MenuItem>
      </MenuPopup>
    </Menu>
  );
}
