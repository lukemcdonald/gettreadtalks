'use client';

import type { User } from '@/services/auth/types';
import type { Route } from 'next';

import {
  ArrowRight as ArrowRightIcon,
  CircleUser as UserIcon,
  LayoutDashboard as ManageIcon,
  LogOut as SignOutIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import { AccountMenuItem } from '@/components/site-header/account-menu/account-menu-item';
import { NavLink } from '@/components/site-header/navigation/nav-link';
import {
  Button,
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui';
import { Link } from '@/components/ui/link';
import { UserAvatar } from '@/components/user-avatar';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { ACCOUNT_PATH, MANAGE_PATH } from '@/lib/entities/paths';
import { isAdmin } from '@/services/auth/utils';

interface AccountMenuProps {
  initialUser?: User | null;
}

export function AccountMenu({ initialUser }: AccountMenuProps) {
  const { data: user } = useCurrentUser(initialUser);
  const pathname = usePathname();

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
  const displayName = user.name ?? user.email;

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
        <MenuItem
          className="min-h-10 w-full items-center justify-start gap-3 px-3 py-2"
          render={<Link href={ACCOUNT_PATH} />}
        >
          <span aria-hidden="true">
            <UserAvatar className="size-8" user={user} />
          </span>
          <span className="truncate text-sm font-semibold">{displayName}</span>
        </MenuItem>
        {!!showManageLink && (
          <AccountMenuItem
            href={MANAGE_PATH}
            icon={ManageIcon}
            label="Manage"
          />
        )}
        <MenuSeparator />
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
