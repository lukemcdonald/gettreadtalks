'use client';

import {
  Heart as FavoritesIcon,
  CheckCircle2 as FinishedIcon,
  Settings as SettingsIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/utils';

const navigation = [
  { href: '/account', label: 'Settings', icon: SettingsIcon },
  { href: '/account/favorites', label: 'Favorites', icon: FavoritesIcon },
  { href: '/account/finished', label: 'Finished', icon: FinishedIcon },
];

export function LayoutSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {navigation.map(({ icon: Icon, href, label }) => {
        const isActive = href === pathname;

        return (
          <Link
            className={cn(
              'flex items-center gap-2 font-medium hover:text-foreground',
              isActive ? 'text-foreground' : 'text-muted-foreground',
            )}
            href={href}
            key={href}
          >
            {Icon && <Icon className="size-4" />}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
