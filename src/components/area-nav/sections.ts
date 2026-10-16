import type { AreaNavSection } from './area-nav';

import {
  ACCOUNT_PATH,
  ADMIN_LIST_PATHS,
  MANAGE_PATH,
} from '@/lib/entities/paths';

export const AREA_NAV: AreaNavSection[] = [
  {
    href: ACCOUNT_PATH,
    items: [{ href: ACCOUNT_PATH, icon: 'settings', label: 'Settings' }],
    label: 'Settings',
  },
  {
    href: '/account/favorites',
    items: [
      { href: '/account/favorites', icon: 'favorites', label: 'Favorites' },
      { href: '/account/finished', icon: 'finished', label: 'Finished' },
    ],
    label: 'Content',
  },
  {
    href: ADMIN_LIST_PATHS.talks,
    items: [
      { href: ADMIN_LIST_PATHS.talks, icon: 'talks', label: 'Talks' },
      { href: ADMIN_LIST_PATHS.clips, icon: 'clips', label: 'Clips' },
      { href: ADMIN_LIST_PATHS.speakers, icon: 'speakers', label: 'Speakers' },
      { href: ADMIN_LIST_PATHS.topics, icon: 'topics', label: 'Topics' },
      {
        href: ADMIN_LIST_PATHS.collections,
        icon: 'collections',
        label: 'Collections',
      },
    ],
    label: 'Manage',
  },
];

export function getVisibleSections(showManage: boolean) {
  if (showManage) {
    return AREA_NAV;
  }

  return AREA_NAV.filter((section) => !isManagePath(section.href));
}

export function isManagePath(pathname: string) {
  return pathname === MANAGE_PATH || pathname.startsWith(`${MANAGE_PATH}/`);
}
