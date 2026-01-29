import {
  Heart as FavoritesIcon,
  CheckCircle2 as FinishedIcon,
  Settings as SettingsIcon,
} from 'lucide-react';

import { LayoutSidebarNavItem } from '@/app/account/_components/layout-sidebar-nav-item';

const NAV_ITEMS = [
  { href: '/account', label: 'Settings', icon: SettingsIcon },
  { href: '/account/favorites', label: 'Favorites', icon: FavoritesIcon },
  { href: '/account/finished', label: 'Finished', icon: FinishedIcon },
];

export function LayoutSidebarNav() {
  return (
    <nav className="flex flex-col gap-2">
      {NAV_ITEMS.map((item) => (
        <LayoutSidebarNavItem
          href={item.href}
          icon={item.icon}
          key={item.href}
          label={item.label}
        />
      ))}
    </nav>
  );
}
