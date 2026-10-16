import type { Route } from 'next';
import type { ComponentType, SVGProps } from 'react';

import {
  CheckCircle2 as FinishedIcon,
  Heart as FavoritesIcon,
  LayoutDashboard as ManageIcon,
  Settings as SettingsIcon,
} from 'lucide-react';

import { ACCOUNT_PATH, MANAGE_PATH } from '@/lib/entities/paths';

interface AccountMenuLink {
  href: Route;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
}

const ACCOUNT_MENU_LINKS = [
  { href: '/account/favorites', icon: FavoritesIcon, label: 'Favorites' },
  { href: '/account/finished', icon: FinishedIcon, label: 'Finished' },
  { href: ACCOUNT_PATH, icon: SettingsIcon, label: 'Settings' },
] as const satisfies readonly AccountMenuLink[];

const ACCOUNT_MENU_ADMIN_LINK = {
  href: MANAGE_PATH,
  icon: ManageIcon,
  label: 'Manage',
} as const satisfies AccountMenuLink;

export const ACCOUNT_MENU_SIGN_OUT_HREF = '/logout' as Route;

export function getAccountMenuLinks(showManage: boolean) {
  if (!showManage) {
    return ACCOUNT_MENU_LINKS;
  }

  return [...ACCOUNT_MENU_LINKS, ACCOUNT_MENU_ADMIN_LINK];
}

export function isAccountMenuLinkActive(href: string, pathname: string) {
  if (href === MANAGE_PATH) {
    return pathname.startsWith(MANAGE_PATH);
  }

  return pathname === href;
}
