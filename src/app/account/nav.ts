import type { AreaNavSections } from '@/components/area-nav';

export const ACCOUNT_NAV: AreaNavSections = [
  {
    href: '/account',
    items: [{ href: '/account', icon: 'settings', label: 'Settings' }],
    label: 'Settings',
  },
  {
    href: '/account/favorites',
    items: [
      { href: '/account/favorites', icon: 'favorites', label: 'Favorites' },
      { href: '/account/finished', icon: 'finished', label: 'Finished' },
    ],
    label: 'Library',
  },
];
