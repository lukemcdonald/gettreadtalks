import type { Route } from 'next';
import type { ComponentType, SVGProps } from 'react';

import { LayoutDashboardIcon } from 'lucide-react';

import { AREA_NAV_ICONS } from '@/components/area-nav/icons';
import {
  getVisibleSections,
  isManagePath,
} from '@/components/area-nav/sections';

interface AccountMenuLink {
  href: Route;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
}

export const ACCOUNT_MENU_SIGN_OUT_HREF = '/logout' as Route;

export function getAccountMenuLinks(showContent: boolean) {
  return getVisibleSections(showContent).flatMap((section) => {
    if (isManagePath(section.href)) {
      return [
        {
          href: section.href,
          icon: LayoutDashboardIcon,
          label: section.label,
        } satisfies AccountMenuLink,
      ];
    }

    return section.items.map(
      (item) =>
        ({
          href: item.href,
          icon: AREA_NAV_ICONS[item.icon],
          label: item.label,
        }) satisfies AccountMenuLink
    );
  });
}

export function isAccountMenuLinkActive(href: string, pathname: string) {
  if (isManagePath(href)) {
    return isManagePath(pathname);
  }

  return pathname === href;
}
