'use client';

import type { User } from '@/services/auth/types';

import {
  ArrowRight as ArrowRightIcon,
  CircleUser as UserIcon,
  LogOut as SignOutIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import { AccountAvatar } from '@/components/site-header/account-menu/account-avatar';
import { AccountIdentity } from '@/components/site-header/account-menu/account-identity';
import { AccountMenuItem } from '@/components/site-header/account-menu/account-menu-item';
import {
  ACCOUNT_MENU_SIGN_OUT_HREF,
  getAccountMenuLinks,
} from '@/components/site-header/account-menu/account-menu-links';
import { NavLink } from '@/components/site-header/navigation/nav-link';
import {
  Button,
  Menu,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui';
import { Link } from '@/components/ui/link';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';
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

  const showContentLink = isAdmin(user);

  return (
    <Menu>
      <MenuTrigger
        openOnHover
        render={
          <Button
            className="size-10"
            data-testid="account-menu"
            size="icon-xl"
            variant="ghost"
          />
        }
      >
        <AccountAvatar user={user} />
      </MenuTrigger>
      <MenuPopup className="w-60">
        <AccountIdentity className="px-3" user={user} />
        <MenuSeparator />
        {getAccountMenuLinks(showContentLink).map((link) => (
          <AccountMenuItem
            href={link.href}
            icon={link.icon}
            key={link.href}
            label={link.label}
          />
        ))}
        <AccountMenuItem
          className="text-muted-foreground"
          data-testid="sign-out"
          href={ACCOUNT_MENU_SIGN_OUT_HREF}
          icon={SignOutIcon}
          label="Sign out"
        />
      </MenuPopup>
    </Menu>
  );
}
